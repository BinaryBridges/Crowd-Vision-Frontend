import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { api } from './_generated/api';

type GenderSummary = {
	male: number;
	female: number;
	unknown: number;
};

type AgeSummary = {
	min: number;
	max: number;
};

type EventAgeSummary = {
	average: number;
	median: number;
	min: number;
	max: number;
};

type GenderDistributionKey =
	| 'g0_10'
	| 'g11_20'
	| 'g21_30'
	| 'g31_40'
	| 'g41_50'
	| 'g51_60'
	| 'g61_70'
	| 'g71_80'
	| 'g81_90'
	| 'g91_100'
	| 'g101';

type AgeDistributionKey =
	| 'a0_10'
	| 'a11_20'
	| 'a21_30'
	| 'a31_40'
	| 'a41_50'
	| 'a51_60'
	| 'a61_70'
	| 'a71_80'
	| 'a81_90'
	| 'a91_100'
	| 'a101';

type GenderDistribution = Record<GenderDistributionKey, GenderSummary>;
type AgeDistribution = Record<AgeDistributionKey, number>;

type EventPayload = {
	name: string;
	price: number;
	age: EventAgeSummary;
	age_distribution: AgeDistribution;
	gender: GenderSummary;
	gender_distribution: GenderDistribution;
	data_quality: number;
};

type UserPayload = {
	name: string;
	total_gender: GenderSummary;
	total_gender_distribution: GenderDistribution;
	total_age: AgeSummary;
	total_age_distribution: AgeDistribution;
	events: (string | EventPayload)[];
};

const GENDER_SUMMARY_KEYS: (keyof GenderSummary)[] = ['male', 'female', 'unknown'];
const GENDER_BUCKET_KEYS: GenderDistributionKey[] = [
	'g0_10',
	'g11_20',
	'g21_30',
	'g31_40',
	'g41_50',
	'g51_60',
	'g61_70',
	'g71_80',
	'g81_90',
	'g91_100',
	'g101'
];
const AGE_BUCKET_KEYS: AgeDistributionKey[] = [
	'a0_10',
	'a11_20',
	'a21_30',
	'a31_40',
	'a41_50',
	'a51_60',
	'a61_70',
	'a71_80',
	'a81_90',
	'a91_100',
	'a101'
];

const http = httpRouter();

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' }
	});

const asErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : 'Unknown error';

function assertObject(value: unknown, path: string): Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new Error(`${path} must be an object`);
	}
	return value as Record<string, unknown>;
}

function assertArray(value: unknown, path: string): unknown[] {
	if (!Array.isArray(value)) {
		throw new Error(`${path} must be an array`);
	}
	return value;
}

function assertNumber(value: unknown, path: string): number {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		throw new Error(`${path} must be a number`);
	}
	return value;
}

function assertString(value: unknown, path: string): string {
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`${path} must be a non-empty string`);
	}
	return value;
}

function parseDistribution(
	source: Record<string, unknown>,
	keys: readonly string[],
	path: string
): Record<string, number> {
	const result: Record<string, number> = {};
	for (const key of keys) {
		if (!(key in source)) {
			throw new Error(`${path}.${key} is required`);
		}
		result[key] = assertNumber(source[key], `${path}.${key}`);
	}
	return result;
}

function parseGenderSummary(value: unknown, path: string): GenderSummary {
	const record = assertObject(value, path);
	const distribution = parseDistribution(record, GENDER_SUMMARY_KEYS, path);
	return distribution as GenderSummary;
}

function parseGenderDistribution(value: unknown, path: string): GenderDistribution {
	const record = assertObject(value, path);
	const distribution: Partial<GenderDistribution> = {};

	for (const key of GENDER_BUCKET_KEYS) {
		if (!(key in record)) {
			throw new Error(`Missing required key "${key}" in ${path}`);
		}
		distribution[key] = parseGenderSummary(record[key], `${path}.${key}`);
	}

	return distribution as GenderDistribution;
}

function parseAgeDistribution(value: unknown, path: string): AgeDistribution {
	const record = assertObject(value, path);
	const distribution = parseDistribution(record, AGE_BUCKET_KEYS, path);
	return distribution as AgeDistribution;
}

function parseAgeSummary(value: unknown, path: string): AgeSummary {
	const record = assertObject(value, path);
	return {
		min: assertNumber(record.min, `${path}.min`),
		max: assertNumber(record.max, `${path}.max`)
	};
}

function parseEventAgeSummary(value: unknown, path: string): EventAgeSummary {
	const record = assertObject(value, path);
	return {
		average: assertNumber(record.average, `${path}.average`),
		median: assertNumber(record.median, `${path}.median`),
		min: assertNumber(record.min, `${path}.min`),
		max: assertNumber(record.max, `${path}.max`)
	};
}

function parseEventPayload(input: unknown, path = 'event'): EventPayload {
	const record = assertObject(input, path);
	return {
		name: assertString(record.name, `${path}.name`),
		price: assertNumber(record.price, `${path}.price`),
		age: parseEventAgeSummary(record.age, `${path}.age`),
		age_distribution: parseAgeDistribution(record.age_distribution, `${path}.age_distribution`),
		gender: parseGenderSummary(record.gender, `${path}.gender`),
		gender_distribution: parseGenderDistribution(
			record.gender_distribution,
			`${path}.gender_distribution`
		),
		data_quality: assertNumber(record.data_quality, `${path}.data_quality`)
	};
}

function parseEventsList(value: unknown, path: string): (string | EventPayload)[] {
	if (value === undefined) {
		return [];
	}
	const list = assertArray(value, path);
	return list.map((entry, index) => {
		const entryPath = `${path}[${index}]`;
		if (typeof entry === 'string') {
			return assertString(entry, entryPath);
		}
		return parseEventPayload(entry, entryPath);
	});
}

function parseEventIdList(value: unknown, path: string): Id<'events'>[] {
	const list = assertArray(value, path);
	return list.map((entry, index) => assertString(entry, `${path}[${index}]`) as Id<'events'>);
}

function parseUserPayload(input: unknown): UserPayload {
	const record = assertObject(input, 'user');
	return {
		name: assertString(record.name, 'user.name'),
		total_gender: parseGenderSummary(record.total_gender, 'user.total_gender'),
		total_gender_distribution: parseGenderDistribution(
			record.total_gender_distribution,
			'user.total_gender_distribution'
		),
		total_age: parseAgeSummary(record.total_age, 'user.total_age'),
		total_age_distribution: parseAgeDistribution(
			record.total_age_distribution,
			'user.total_age_distribution'
		),
		events: parseEventsList(record.events, 'user.events')
	};
}

http.route({
	path: '/ingest/events',
	method: 'POST',
	handler: httpAction(async ({ runMutation }, request) => {
		try {
			const payload = parseEventPayload(await request.json());
			const id = await runMutation(api.events.save, payload);
			return jsonResponse({ id });
		} catch (error) {
			return jsonResponse({ error: asErrorMessage(error) }, 400);
		}
	})
});

http.route({
	path: '/ingest/users',
	method: 'POST',
	handler: httpAction(async ({ runMutation, runQuery }, request) => {
		try {
			const payload = parseUserPayload(await request.json());

			const eventIds: Id<'events'>[] = [];
			for (const entry of payload.events) {
				if (typeof entry === 'string') {
					const existing = await runQuery(api.events.getByName, { name: entry });
					if (!existing) {
						throw new Error(
							`Unknown event "${entry}". Include the full event object to create it.`
						);
					}
					eventIds.push(existing._id);
				} else {
					const eventId = await runMutation(api.events.save, entry);
					eventIds.push(eventId);
				}
			}

			const id = await runMutation(api.users.save, {
				name: payload.name,
				total_gender: payload.total_gender,
				total_gender_distribution: payload.total_gender_distribution,
				total_age: payload.total_age,
				total_age_distribution: payload.total_age_distribution,
				events: eventIds
			});

			return jsonResponse({ id });
		} catch (error) {
			return jsonResponse({ error: asErrorMessage(error) }, 400);
		}
	})
});

http.route({
	path: '/ingest/users/update',
	method: 'POST',
	handler: httpAction(async ({ runMutation }, request) => {
		try {
			const payload = assertObject(await request.json(), 'payload');
			const id = await runMutation(api.users.addTotalsById, {
				userId: assertString(payload.userId, 'payload.userId') as Id<'users'>,
				total_gender: parseGenderSummary(payload.total_gender, 'payload.total_gender'),
				total_gender_distribution: parseGenderDistribution(
					payload.total_gender_distribution,
					'payload.total_gender_distribution'
				),
				total_age: parseAgeSummary(payload.total_age, 'payload.total_age'),
				total_age_distribution: parseAgeDistribution(
					payload.total_age_distribution,
					'payload.total_age_distribution'
				),
				events: parseEventIdList(payload.events, 'payload.events')
			});
			return jsonResponse({ id });
		} catch (error) {
			return jsonResponse({ error: asErrorMessage(error) }, 400);
		}
	})
});

// Get user by ID
http.route({
	path: '/users/:userId',
	method: 'GET',
	handler: httpAction(async ({ runQuery }, request) => {
		try {
			const url = new URL(request.url);
			const userId = url.pathname.split('/').pop();

			if (!userId) {
				return jsonResponse({ error: 'User ID is required' }, 400);
			}

			const user = await runQuery(api.users.getById, {
				userId: userId as Id<'users'>
			});

			if (!user) {
				return jsonResponse({ error: 'User not found' }, 404);
			}

			return jsonResponse(user);
		} catch (error) {
			return jsonResponse({ error: asErrorMessage(error) }, 400);
		}
	})
});

export default http;
