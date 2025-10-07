import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import {
	ageDistributionValidator,
	eventAgeSummaryValidator,
	genderDistributionValidator,
	genderBucketValidator
} from './validators';

export const list = query({
	handler: async ({ db }) => {
		const events = await db.query('events').collect();
		return events.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const getByName = query({
	args: { name: v.string() },
	handler: async ({ db }, { name }) => {
		return await db
			.query('events')
			.withIndex('by_name', (q) => q.eq('name', name))
			.unique();
	}
});

export const getByClient = query({
	args: { clientId: v.id('clients') },
	handler: async ({ db }, { clientId }) => {
		const events = await db
			.query('events')
			.withIndex('by_client', (q) => q.eq('client', clientId))
			.collect();
		return events.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const getByStatus = query({
	args: { status: v.string() },
	handler: async ({ db }, { status }) => {
		const events = await db
			.query('events')
			.withIndex('by_status', (q) => q.eq('status', status))
			.collect();
		return events.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const getFavourites = query({
	handler: async ({ db }) => {
		const events = await db
			.query('events')
			.withIndex('by_favourite', (q) => q.eq('favourite', true))
			.collect();
		return events.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const create = mutation({
	args: {
		name: v.string(),
		image: v.string(),
		client: v.id('clients'),
		status: v.string(),
		userId: v.optional(v.id('users'))
	},
	handler: async ({ db }, { name, image, client, status, userId }) => {
		// Create event with minimal data, setting defaults for analysis fields
		const eventId = await db.insert('events', {
			name,
			image,
			client,
			status,
			favourite: false,
			price: 0,
			completion_time: Date.now(),
			// Default empty analysis data
			age: {
				min: 0,
				max: 0,
				average: 0,
				median: 0
			},
			age_distribution: {
				a0_10: 0,
				a11_20: 0,
				a21_30: 0,
				a31_40: 0,
				a41_50: 0,
				a51_60: 0,
				a61_70: 0,
				a71_80: 0,
				a81_90: 0,
				a91_100: 0,
				a101: 0
			},
			gender: {
				male: 0,
				female: 0,
				unknown: 0
			},
			gender_distribution: {
				g0_10: { male: 0, female: 0, unknown: 0 },
				g11_20: { male: 0, female: 0, unknown: 0 },
				g21_30: { male: 0, female: 0, unknown: 0 },
				g31_40: { male: 0, female: 0, unknown: 0 },
				g41_50: { male: 0, female: 0, unknown: 0 },
				g51_60: { male: 0, female: 0, unknown: 0 },
				g61_70: { male: 0, female: 0, unknown: 0 },
				g71_80: { male: 0, female: 0, unknown: 0 },
				g81_90: { male: 0, female: 0, unknown: 0 },
				g91_100: { male: 0, female: 0, unknown: 0 },
				g101: { male: 0, female: 0, unknown: 0 }
			},
			data_quality: 0
		});

		// If userId provided, add this event to the user
		if (userId) {
			const user = await db.get(userId);
			if (user) {
				await db.patch(userId, {
					events: [...user.events, eventId]
				});
			}
		}

		return eventId;
	}
});

export const addToUser = mutation({
	args: {
		userId: v.id('users'),
		eventId: v.id('events')
	},
	handler: async ({ db }, { userId, eventId }) => {
		const user = await db.get(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const event = await db.get(eventId);
		if (!event) {
			throw new Error('Event not found');
		}

		// Check if event is already in user's events
		if (!user.events.includes(eventId)) {
			await db.patch(userId, {
				events: [...user.events, eventId]
			});
		}

		return userId;
	}
});

export const updateStatus = mutation({
	args: {
		eventId: v.id('events'),
		status: v.string()
	},
	handler: async ({ db }, { eventId, status }) => {
		await db.patch(eventId, { status });
		return eventId;
	}
});

export const save = mutation({
	args: {
		name: v.string(),
		price: v.float64(),
		age: eventAgeSummaryValidator,
		age_distribution: ageDistributionValidator,
		gender: genderBucketValidator,
		gender_distribution: genderDistributionValidator,
		data_quality: v.float64(),
		client: v.id('clients'),
		image: v.string(),
		completion_time: v.number(),
		status: v.string(),
		favourite: v.boolean()
	},
	handler: async ({ db }, args) => {
		const existing = await db
			.query('events')
			.withIndex('by_name', (q) => q.eq('name', args.name))
			.unique();

		if (existing) {
			await db.patch(existing._id, {
				price: args.price,
				age: args.age,
				age_distribution: args.age_distribution,
				gender: args.gender,
				gender_distribution: args.gender_distribution,
				data_quality: args.data_quality,
				client: args.client,
				image: args.image,
				completion_time: args.completion_time,
				status: args.status,
				favourite: args.favourite
			});
			return existing._id;
		}

		return await db.insert('events', args);
	}
});

export const updateAnalysisData = mutation({
	args: {
		eventId: v.id('events'),
		price: v.optional(v.float64()),
		age: v.optional(eventAgeSummaryValidator),
		age_distribution: v.optional(ageDistributionValidator),
		gender: v.optional(genderBucketValidator),
		gender_distribution: v.optional(genderDistributionValidator),
		data_quality: v.optional(v.float64()),
		status: v.optional(v.string()),
		favourite: v.optional(v.boolean())
	},
	handler: async ({ db }, { eventId, ...updates }) => {
		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		);

		if (Object.keys(filteredUpdates).length > 0) {
			await db.patch(eventId, filteredUpdates);
		}

		return eventId;
	}
});

export const updateAnalysisDataWithUser = mutation({
	args: {
		eventId: v.id('events'),
		userId: v.optional(v.id('users')),
		price: v.optional(v.float64()),
		age: v.optional(eventAgeSummaryValidator),
		age_distribution: v.optional(ageDistributionValidator),
		gender: v.optional(genderBucketValidator),
		gender_distribution: v.optional(genderDistributionValidator),
		data_quality: v.optional(v.float64()),
		status: v.optional(v.string()),
		favourite: v.optional(v.boolean())
	},
	handler: async ({ db }, { eventId, userId, ...updates }) => {
		// Filter out undefined values for event updates
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		);

		// Update the event
		if (Object.keys(filteredUpdates).length > 0) {
			await db.patch(eventId, filteredUpdates);
		}

		// If userId is provided, update the user's totals additively
		if (
			userId &&
			(updates.age || updates.age_distribution || updates.gender || updates.gender_distribution)
		) {
			const user = await db.get(userId);
			if (!user) {
				throw new Error('User not found');
			}

			// Prepare the data to add to user totals
			const userUpdates: Record<string, unknown> = {};

			if (updates.gender) {
				userUpdates.total_gender = {
					male: user.total_gender.male + updates.gender.male,
					female: user.total_gender.female + updates.gender.female,
					unknown: user.total_gender.unknown + updates.gender.unknown
				};
			}

			if (updates.age) {
				userUpdates.total_age = {
					min:
						user.total_age.min === 0 && user.total_age.max === 0
							? updates.age.min
							: Math.min(user.total_age.min, updates.age.min),
					max:
						user.total_age.min === 0 && user.total_age.max === 0
							? updates.age.max
							: Math.max(user.total_age.max, updates.age.max)
				};
			}

			if (updates.age_distribution) {
				userUpdates.total_age_distribution = {
					a0_10: user.total_age_distribution.a0_10 + updates.age_distribution.a0_10,
					a11_20: user.total_age_distribution.a11_20 + updates.age_distribution.a11_20,
					a21_30: user.total_age_distribution.a21_30 + updates.age_distribution.a21_30,
					a31_40: user.total_age_distribution.a31_40 + updates.age_distribution.a31_40,
					a41_50: user.total_age_distribution.a41_50 + updates.age_distribution.a41_50,
					a51_60: user.total_age_distribution.a51_60 + updates.age_distribution.a51_60,
					a61_70: user.total_age_distribution.a61_70 + updates.age_distribution.a61_70,
					a71_80: user.total_age_distribution.a71_80 + updates.age_distribution.a71_80,
					a81_90: user.total_age_distribution.a81_90 + updates.age_distribution.a81_90,
					a91_100: user.total_age_distribution.a91_100 + updates.age_distribution.a91_100,
					a101: user.total_age_distribution.a101 + updates.age_distribution.a101
				};
			}

			if (updates.gender_distribution) {
				userUpdates.total_gender_distribution = {
					g0_10: {
						male:
							user.total_gender_distribution.g0_10.male + updates.gender_distribution.g0_10.male,
						female:
							user.total_gender_distribution.g0_10.female +
							updates.gender_distribution.g0_10.female,
						unknown:
							user.total_gender_distribution.g0_10.unknown +
							updates.gender_distribution.g0_10.unknown
					},
					g11_20: {
						male:
							user.total_gender_distribution.g11_20.male + updates.gender_distribution.g11_20.male,
						female:
							user.total_gender_distribution.g11_20.female +
							updates.gender_distribution.g11_20.female,
						unknown:
							user.total_gender_distribution.g11_20.unknown +
							updates.gender_distribution.g11_20.unknown
					},
					g21_30: {
						male:
							user.total_gender_distribution.g21_30.male + updates.gender_distribution.g21_30.male,
						female:
							user.total_gender_distribution.g21_30.female +
							updates.gender_distribution.g21_30.female,
						unknown:
							user.total_gender_distribution.g21_30.unknown +
							updates.gender_distribution.g21_30.unknown
					},
					g31_40: {
						male:
							user.total_gender_distribution.g31_40.male + updates.gender_distribution.g31_40.male,
						female:
							user.total_gender_distribution.g31_40.female +
							updates.gender_distribution.g31_40.female,
						unknown:
							user.total_gender_distribution.g31_40.unknown +
							updates.gender_distribution.g31_40.unknown
					},
					g41_50: {
						male:
							user.total_gender_distribution.g41_50.male + updates.gender_distribution.g41_50.male,
						female:
							user.total_gender_distribution.g41_50.female +
							updates.gender_distribution.g41_50.female,
						unknown:
							user.total_gender_distribution.g41_50.unknown +
							updates.gender_distribution.g41_50.unknown
					},
					g51_60: {
						male:
							user.total_gender_distribution.g51_60.male + updates.gender_distribution.g51_60.male,
						female:
							user.total_gender_distribution.g51_60.female +
							updates.gender_distribution.g51_60.female,
						unknown:
							user.total_gender_distribution.g51_60.unknown +
							updates.gender_distribution.g51_60.unknown
					},
					g61_70: {
						male:
							user.total_gender_distribution.g61_70.male + updates.gender_distribution.g61_70.male,
						female:
							user.total_gender_distribution.g61_70.female +
							updates.gender_distribution.g61_70.female,
						unknown:
							user.total_gender_distribution.g61_70.unknown +
							updates.gender_distribution.g61_70.unknown
					},
					g71_80: {
						male:
							user.total_gender_distribution.g71_80.male + updates.gender_distribution.g71_80.male,
						female:
							user.total_gender_distribution.g71_80.female +
							updates.gender_distribution.g71_80.female,
						unknown:
							user.total_gender_distribution.g71_80.unknown +
							updates.gender_distribution.g71_80.unknown
					},
					g81_90: {
						male:
							user.total_gender_distribution.g81_90.male + updates.gender_distribution.g81_90.male,
						female:
							user.total_gender_distribution.g81_90.female +
							updates.gender_distribution.g81_90.female,
						unknown:
							user.total_gender_distribution.g81_90.unknown +
							updates.gender_distribution.g81_90.unknown
					},
					g91_100: {
						male:
							user.total_gender_distribution.g91_100.male +
							updates.gender_distribution.g91_100.male,
						female:
							user.total_gender_distribution.g91_100.female +
							updates.gender_distribution.g91_100.female,
						unknown:
							user.total_gender_distribution.g91_100.unknown +
							updates.gender_distribution.g91_100.unknown
					},
					g101: {
						male: user.total_gender_distribution.g101.male + updates.gender_distribution.g101.male,
						female:
							user.total_gender_distribution.g101.female + updates.gender_distribution.g101.female,
						unknown:
							user.total_gender_distribution.g101.unknown + updates.gender_distribution.g101.unknown
					}
				};
			}

			// Ensure the event is in the user's events array if not already present
			if (!user.events.includes(eventId)) {
				userUpdates.events = [...user.events, eventId];
			}

			// Apply the updates to the user
			if (Object.keys(userUpdates).length > 0) {
				await db.patch(userId, userUpdates);
			}
		}

		return eventId;
	}
});
