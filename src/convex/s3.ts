import { action } from './_generated/server';
import { v } from 'convex/values';
import {
	S3Client,
	PutObjectCommand,
	CreateMultipartUploadCommand,
	UploadPartCommand,
	CompleteMultipartUploadCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const presign = action({
	args: {
		userId: v.string(),
		eventId: v.string(),
		files: v.array(v.object({ name: v.string(), type: v.string(), size: v.number() }))
	},
	handler: async (_ctx, { userId, eventId, files }) => {
		const { AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
			process.env as Record<string, string | undefined>;

		if (!AWS_REGION) throw new Error('Missing AWS_REGION env');
		if (!AWS_S3_BUCKET) throw new Error('Missing AWS_S3_BUCKET env');

		const s3 = new S3Client({
			region: AWS_REGION,
			credentials:
				AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
					? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
					: undefined
		});

		// Ensure folder markers
		const markerKeys = [
			`${userId}/`,
			`${userId}/${eventId}/`,
			`${userId}/${eventId}/raw_video/`,
			`${userId}/${eventId}/split_video/`
		];

		await Promise.all(
			markerKeys.map((Key) =>
				s3
					.send(
						new PutObjectCommand({
							Bucket: AWS_S3_BUCKET,
							Key,
							Body: new Uint8Array(),
							ContentType: 'application/x-directory'
						})
					)
					.catch(() => undefined)
			)
		);

		const SINGLE_PUT_THRESHOLD = 100 * 1024 * 1024; // 100MB
		const PART_SIZE = 10 * 1024 * 1024; // 10MB

		const uploads = await Promise.all(
			files.map(async ({ name, type, size }) => {
				const Key = `${userId}/${eventId}/raw_video/${name}`;
				if (size <= SINGLE_PUT_THRESHOLD) {
					const cmd = new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key, ContentType: type });
					const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
					return { mode: 'single' as const, key: Key, url, contentType: type };
				}

				const init = await s3.send(
					new CreateMultipartUploadCommand({ Bucket: AWS_S3_BUCKET, Key, ContentType: type })
				);
				const uploadId = init.UploadId!;
				const partCount = Math.ceil(size / PART_SIZE);
				const partUrls = await Promise.all(
					Array.from({ length: partCount }).map(async (_v, i) => {
						const partNumber = i + 1;
						const up = new UploadPartCommand({
							Bucket: AWS_S3_BUCKET,
							Key,
							UploadId: uploadId,
							PartNumber: partNumber
						});
						const url = await getSignedUrl(s3, up, { expiresIn: 900 });
						return { partNumber, url };
					})
				);
				return { mode: 'multipart' as const, key: Key, uploadId, partSize: PART_SIZE, partUrls };
			})
		);

		return { bucket: AWS_S3_BUCKET, region: AWS_REGION, uploads };
	}
});

export const completeMultipart = action({
	args: {
		key: v.string(),
		uploadId: v.string(),
		parts: v.array(v.object({ partNumber: v.number(), etag: v.string() }))
	},
	handler: async (_ctx, { key, uploadId, parts }) => {
		const { AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
			process.env as Record<string, string | undefined>;

		if (!AWS_REGION) throw new Error('Missing AWS_REGION env');
		if (!AWS_S3_BUCKET) throw new Error('Missing AWS_S3_BUCKET env');

		const s3 = new S3Client({
			region: AWS_REGION,
			credentials:
				AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
					? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
					: undefined
		});

		await s3.send(
			new CompleteMultipartUploadCommand({
				Bucket: AWS_S3_BUCKET,
				Key: key,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: parts
						.map((p) => ({
							PartNumber: Math.trunc(p.partNumber),
							ETag: p.etag.replace(/"/g, '')
						}))
						.sort((a, b) => a.PartNumber - b.PartNumber)
				}
			})
		);

		return { key };
	}
});
