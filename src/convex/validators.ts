import { v } from "convex/values";

export const genderBucketValidator = v.object({
  male: v.number(),
  female: v.number(),
  unknown: v.number()
});

export const genderDistributionValidator = v.object({
  "g0_10": genderBucketValidator,
  "g11_20": genderBucketValidator,
  "g21_30": genderBucketValidator,
  "g31_40": genderBucketValidator,
  "g41_50": genderBucketValidator,
  "g51_60": genderBucketValidator,
  "g61_70": genderBucketValidator,
  "g71_80": genderBucketValidator,
  "g81_90": genderBucketValidator,
  "g91_100": genderBucketValidator,
  "g101": genderBucketValidator
});

export const ageSummaryValidator = v.object({
  min: v.number(),
  max: v.number()
});

export const ageDistributionValidator = v.object({
  "a0_10": v.number(),
  "a11_20": v.number(),
  "a21_30": v.number(),
  "a31_40": v.number(),
  "a41_50": v.number(),
  "a51_60": v.number(),
  "a61_70": v.number(),
  "a71_80": v.number(),
  "a81_90": v.number(),
  "a91_100": v.number(),
  "a101": v.number()
});

export const eventAgeSummaryValidator = v.object({
  average: v.number(),
  median: v.number(),
  min: v.number(),
  max: v.number()
});
