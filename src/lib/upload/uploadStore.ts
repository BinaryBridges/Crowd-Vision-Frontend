import { writable, get } from 'svelte/store';

export type UploadDesc =
	| { mode: 'single'; key: string; url: string; contentType: string }
	| {
			mode: 'multipart';
			key: string;
			uploadId: string;
			partSize: number;
			partUrls: { partNumber: number; url: string }[];
	  };

export type UploadTaskStatus = 'pending' | 'uploading' | 'done' | 'error';

export interface UploadTask {
	id: string; // key
	name: string;
	progress: number; // 0-100
	status: UploadTaskStatus;
}

export const uploadStore = writable<{ tasks: UploadTask[]; visible: boolean }>({
	tasks: [],
	visible: true
});

let autoCloseHandle: ReturnType<typeof setTimeout> | undefined;

function scheduleAutoCloseIfAllDone() {
	const s = get(uploadStore);
	const allDone = s.tasks.length > 0 && s.tasks.every((t) => t.status === 'done');
	if (allDone && s.visible) {
		if (autoCloseHandle) clearTimeout(autoCloseHandle);
		autoCloseHandle = setTimeout(() => {
			closeTray();
			autoCloseHandle = undefined;
		}, 5000);
	} else if (!allDone && autoCloseHandle) {
		clearTimeout(autoCloseHandle);
		autoCloseHandle = undefined;
	}
}

function updateTask(id: string, patch: Partial<UploadTask>) {
	uploadStore.update((s) => {
		s.tasks = s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
		return s;
	});
	scheduleAutoCloseIfAllDone();
}

function addTask(task: UploadTask) {
	uploadStore.update((s) => ({ ...s, tasks: [...s.tasks, task] }));
}

function removeFinishedWhenHidden() {
	const s = get(uploadStore);
	if (!s.visible) {
		uploadStore.update((st) => ({ ...st, tasks: st.tasks.filter((t) => t.status !== 'done') }));
	}
}

export function closeTray() {
	uploadStore.update((s) => ({ ...s, visible: false }));
	removeFinishedWhenHidden();
}

// Internal helper using XHR to get upload progress
function putWithProgress(
	url: string,
	blob: Blob,
	contentType?: string,
	onProgress?: (loaded: number, total: number) => void
) {
	return new Promise<{ status: number; etag: string | null }>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', url, true);
		if (contentType) xhr.setRequestHeader('Content-Type', contentType);
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total);
		};
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const etag = xhr.getResponseHeader('ETag') || xhr.getResponseHeader('etag');
				resolve({ status: xhr.status, etag: etag ?? null });
			} else {
				reject(new Error(`PUT failed ${xhr.status}`));
			}
		};
		xhr.onerror = () => reject(new Error('PUT network error'));
		xhr.send(blob);
	});
}

type CompleteMultipartFn = (args: {
	key: string;
	uploadId: string;
	parts: { partNumber: number; etag: string }[];
}) => Promise<unknown>;

export async function queueUploads(
	files: { name: string; file: File }[],
	uploads: UploadDesc[],
	completeMultipart: CompleteMultipartFn,
	onAllDone?: () => Promise<unknown> | void
) {
	if (!uploads || uploads.length === 0) return;
	// Create tasks
	for (const u of uploads) {
		const name = u.key.split('/').pop() || u.key;
		addTask({ id: u.key, name, progress: 0, status: 'pending' });
	}

	await Promise.all(
		uploads.map(async (u) => {
			const file = files.find((f) => u.key.endsWith(`/${f.name}`))?.file;
			if (!file) {
				updateTask(u.key, { status: 'error' });
				return;
			}
			updateTask(u.key, { status: 'uploading', progress: 0 });
			try {
				if (u.mode === 'single') {
					await putWithProgress(u.url, file, u.contentType, (loaded, total) => {
						const pct = total ? Math.floor((loaded / total) * 100) : 0;
						updateTask(u.key, { progress: pct });
					});
				} else {
					const total = file.size;
					const parts: { partNumber: number; etag: string }[] = [];
					for (const { partNumber, url } of u.partUrls) {
						const start = (partNumber - 1) * u.partSize;
						const end = Math.min(start + u.partSize, file.size);
						const blob = file.slice(start, end);
						const res = await putWithProgress(url, blob, undefined, (loaded) => {
							const now = start + loaded;
							const pct = total ? Math.floor((now / total) * 100) : 0;
							updateTask(u.key, { progress: pct });
						});
						parts.push({ partNumber, etag: res.etag || '' });
					}
					await completeMultipart({ key: u.key, uploadId: u.uploadId, parts });
					updateTask(u.key, { progress: 100 });
				}
				updateTask(u.key, { status: 'done', progress: 100 });
			} catch {
				updateTask(u.key, { status: 'error' });
			}
		})
	);

	// Check once more at the end
	scheduleAutoCloseIfAllDone();

	// Fire optional callback after all uploads completed
	try {
		if (onAllDone) await onAllDone();
	} catch {
		// ignore callback errors to avoid impacting UI flow
	}
}
