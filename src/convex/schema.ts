import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
	genderBucketValidator,
	genderDistributionValidator,
	ageSummaryValidator,
	ageDistributionValidator,
	eventAgeSummaryValidator
} from './validators';

export default defineSchema({
	users: defineTable({
		name: v.string(),
		total_gender: genderBucketValidator,
		total_gender_distribution: genderDistributionValidator,
		total_age: ageSummaryValidator,
		total_age_distribution: ageDistributionValidator,
		events: v.array(v.id('events'))
	}).index('by_name', ['name']),
	clients: defineTable({
		name: v.string(),
		company: v.string(),
		representative: v.string(),
		logo: v.string()
	}).index('by_name', ['name']),
	events: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		price: v.float64(),
		age: eventAgeSummaryValidator,
		age_distribution: ageDistributionValidator,
		gender: genderBucketValidator,
		gender_distribution: genderDistributionValidator,
		data_quality: v.float64(),
		client: v.id('clients'),
		image: v.string(),
		completion_time: v.number(),
		start_date: v.optional(v.number()),
		end_date: v.optional(v.number()),
		has_paid: v.optional(v.boolean()),
		status: v.string(),
		favourite: v.boolean()
	})
		.index('by_name', ['name'])
		.index('by_client', ['client'])
		.index('by_status', ['status'])
		.index('by_favourite', ['favourite'])
});
