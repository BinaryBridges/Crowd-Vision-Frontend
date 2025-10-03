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
	events: defineTable({
		name: v.string(),
		price: v.float64(),
		age: eventAgeSummaryValidator,
		age_distribution: ageDistributionValidator,
		gender: genderBucketValidator,
		gender_distribution: genderDistributionValidator,
		data_quality: v.float64()
	}).index('by_name', ['name'])
});
