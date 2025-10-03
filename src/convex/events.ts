import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  ageDistributionValidator,
  eventAgeSummaryValidator,
  genderDistributionValidator,
  genderBucketValidator
} from "./validators";

export const list = query({
  handler: async ({ db }) => {
    const events = await db.query("events").collect();
    return events.sort((a, b) => a.name.localeCompare(b.name));
  }
});

export const getByName = query({
  args: { name: v.string() },
  handler: async ({ db }, { name }) => {
    return await db
      .query("events")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
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
    data_quality: v.float64()
  },
  handler: async ({ db }, args) => {
    const existing = await db
      .query("events")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      await db.patch(existing._id, {
        price: args.price,
        age: args.age,
        age_distribution: args.age_distribution,
        gender: args.gender,
        gender_distribution: args.gender_distribution,
        data_quality: args.data_quality
      });
      return existing._id;
    }

    return await db.insert("events", args);
  }
});
