import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  ageDistributionValidator,
  ageSummaryValidator,
  genderDistributionValidator,
  genderBucketValidator
} from "./validators";

type UserWithEvents = Omit<Doc<"users">, "events"> & { events: Doc<"events">[] };

type MutationDb = MutationCtx["db"];
type QueryDb = QueryCtx["db"];
type AnyDb = MutationDb | QueryDb;

const collectExistingEventIds = async (
  db: AnyDb,
  eventIds?: Id<"events">[]
): Promise<Id<"events">[]> => {
  if (!eventIds?.length) {
    return [];
  }

  const uniqueIds = Array.from(new Set(eventIds)) as Id<"events">[];
  const events: (Doc<"events"> | null)[] = await Promise.all(
    uniqueIds.map((eventId: Id<"events">) => db.get(eventId))
  );
  return uniqueIds.filter((_, index) => events[index] !== null);
};

const attachEvents = async (db: AnyDb, user: Doc<"users">): Promise<UserWithEvents> => {
  const eventDocs: (Doc<"events"> | null)[] = await Promise.all(
    user.events.map((eventId: Id<"events">) => db.get(eventId))
  );
  const resolvedEvents: Doc<"events">[] = eventDocs.filter(
    (event): event is Doc<"events"> => event !== null
  );

  return {
    ...user,
    events: resolvedEvents
  };
};

export const list = query({
  handler: async ({ db }) => {
    const users = await db.query("users").collect();

    const withEvents: UserWithEvents[] = await Promise.all(
      users.map((user) => attachEvents(db, user))
    );

    return withEvents.sort((a, b) => a.name.localeCompare(b.name));
  }
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async ({ db }, { userId }) => {
    const user = await db.get(userId);
    if (!user) {
      return null;
    }

    return await attachEvents(db, user);
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    total_gender: genderBucketValidator,
    total_gender_distribution: genderDistributionValidator,
    total_age: ageSummaryValidator,
    total_age_distribution: ageDistributionValidator,
    events: v.optional(v.array(v.id("events")))
  },
  handler: async ({ db }, args) => {
    const { events, ...rest } = args;
    const validEventIds = await collectExistingEventIds(db, events);

    return await db.insert("users", {
      ...rest,
      events: validEventIds
    });
  }
});

export const updateTotalsById = mutation({
  args: {
    userId: v.id("users"),
    total_gender: genderBucketValidator,
    total_gender_distribution: genderDistributionValidator,
    total_age: ageSummaryValidator,
    total_age_distribution: ageDistributionValidator,
    events: v.array(v.id("events"))
  },
  handler: async ({ db }, { userId, events, ...totals }) => {
    const user = await db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const validEventIds = await collectExistingEventIds(db, events);

    await db.patch(userId, {
      ...totals,
      events: validEventIds
    });

    return userId;
  }
});

export const addTotalsById = mutation({
  args: {
    userId: v.id("users"),
    total_gender: genderBucketValidator,
    total_gender_distribution: genderDistributionValidator,
    total_age: ageSummaryValidator,
    total_age_distribution: ageDistributionValidator,
    events: v.array(v.id("events"))
  },
  handler: async ({ db }, { userId, events, ...newTotals }) => {
    const user = await db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const validEventIds = await collectExistingEventIds(db, events);

    // Add new values to existing values
    const updatedTotals = {
      total_gender: {
        male: user.total_gender.male + newTotals.total_gender.male,
        female: user.total_gender.female + newTotals.total_gender.female,
        unknown: user.total_gender.unknown + newTotals.total_gender.unknown
      },
      total_age: {
        min: user.total_age.min === 0 && user.total_age.max === 0
          ? newTotals.total_age.min
          : Math.min(user.total_age.min, newTotals.total_age.min),
        max: user.total_age.min === 0 && user.total_age.max === 0
          ? newTotals.total_age.max
          : Math.max(user.total_age.max, newTotals.total_age.max)
      },
      total_gender_distribution: {
        g0_10: {
          male: user.total_gender_distribution.g0_10.male + newTotals.total_gender_distribution.g0_10.male,
          female: user.total_gender_distribution.g0_10.female + newTotals.total_gender_distribution.g0_10.female,
          unknown: user.total_gender_distribution.g0_10.unknown + newTotals.total_gender_distribution.g0_10.unknown
        },
        g11_20: {
          male: user.total_gender_distribution.g11_20.male + newTotals.total_gender_distribution.g11_20.male,
          female: user.total_gender_distribution.g11_20.female + newTotals.total_gender_distribution.g11_20.female,
          unknown: user.total_gender_distribution.g11_20.unknown + newTotals.total_gender_distribution.g11_20.unknown
        },
        g21_30: {
          male: user.total_gender_distribution.g21_30.male + newTotals.total_gender_distribution.g21_30.male,
          female: user.total_gender_distribution.g21_30.female + newTotals.total_gender_distribution.g21_30.female,
          unknown: user.total_gender_distribution.g21_30.unknown + newTotals.total_gender_distribution.g21_30.unknown
        },
        g31_40: {
          male: user.total_gender_distribution.g31_40.male + newTotals.total_gender_distribution.g31_40.male,
          female: user.total_gender_distribution.g31_40.female + newTotals.total_gender_distribution.g31_40.female,
          unknown: user.total_gender_distribution.g31_40.unknown + newTotals.total_gender_distribution.g31_40.unknown
        },
        g41_50: {
          male: user.total_gender_distribution.g41_50.male + newTotals.total_gender_distribution.g41_50.male,
          female: user.total_gender_distribution.g41_50.female + newTotals.total_gender_distribution.g41_50.female,
          unknown: user.total_gender_distribution.g41_50.unknown + newTotals.total_gender_distribution.g41_50.unknown
        },
        g51_60: {
          male: user.total_gender_distribution.g51_60.male + newTotals.total_gender_distribution.g51_60.male,
          female: user.total_gender_distribution.g51_60.female + newTotals.total_gender_distribution.g51_60.female,
          unknown: user.total_gender_distribution.g51_60.unknown + newTotals.total_gender_distribution.g51_60.unknown
        },
        g61_70: {
          male: user.total_gender_distribution.g61_70.male + newTotals.total_gender_distribution.g61_70.male,
          female: user.total_gender_distribution.g61_70.female + newTotals.total_gender_distribution.g61_70.female,
          unknown: user.total_gender_distribution.g61_70.unknown + newTotals.total_gender_distribution.g61_70.unknown
        },
        g71_80: {
          male: user.total_gender_distribution.g71_80.male + newTotals.total_gender_distribution.g71_80.male,
          female: user.total_gender_distribution.g71_80.female + newTotals.total_gender_distribution.g71_80.female,
          unknown: user.total_gender_distribution.g71_80.unknown + newTotals.total_gender_distribution.g71_80.unknown
        },
        g81_90: {
          male: user.total_gender_distribution.g81_90.male + newTotals.total_gender_distribution.g81_90.male,
          female: user.total_gender_distribution.g81_90.female + newTotals.total_gender_distribution.g81_90.female,
          unknown: user.total_gender_distribution.g81_90.unknown + newTotals.total_gender_distribution.g81_90.unknown
        },
        g91_100: {
          male: user.total_gender_distribution.g91_100.male + newTotals.total_gender_distribution.g91_100.male,
          female: user.total_gender_distribution.g91_100.female + newTotals.total_gender_distribution.g91_100.female,
          unknown: user.total_gender_distribution.g91_100.unknown + newTotals.total_gender_distribution.g91_100.unknown
        },
        g101: {
          male: user.total_gender_distribution.g101.male + newTotals.total_gender_distribution.g101.male,
          female: user.total_gender_distribution.g101.female + newTotals.total_gender_distribution.g101.female,
          unknown: user.total_gender_distribution.g101.unknown + newTotals.total_gender_distribution.g101.unknown
        }
      },
      total_age_distribution: {
        a0_10: user.total_age_distribution.a0_10 + newTotals.total_age_distribution.a0_10,
        a11_20: user.total_age_distribution.a11_20 + newTotals.total_age_distribution.a11_20,
        a21_30: user.total_age_distribution.a21_30 + newTotals.total_age_distribution.a21_30,
        a31_40: user.total_age_distribution.a31_40 + newTotals.total_age_distribution.a31_40,
        a41_50: user.total_age_distribution.a41_50 + newTotals.total_age_distribution.a41_50,
        a51_60: user.total_age_distribution.a51_60 + newTotals.total_age_distribution.a51_60,
        a61_70: user.total_age_distribution.a61_70 + newTotals.total_age_distribution.a61_70,
        a71_80: user.total_age_distribution.a71_80 + newTotals.total_age_distribution.a71_80,
        a81_90: user.total_age_distribution.a81_90 + newTotals.total_age_distribution.a81_90,
        a91_100: user.total_age_distribution.a91_100 + newTotals.total_age_distribution.a91_100,
        a101: user.total_age_distribution.a101 + newTotals.total_age_distribution.a101
      },
      events: [...user.events, ...validEventIds] // Combine existing and new event IDs
    };

    await db.patch(userId, updatedTotals);

    return userId;
  }
});

export const save = mutation({
  args: {
    name: v.string(),
    total_gender: genderBucketValidator,
    total_gender_distribution: genderDistributionValidator,
    total_age: ageSummaryValidator,
    total_age_distribution: ageDistributionValidator,
    events: v.array(v.id("events"))
  },
  handler: async ({ db }, args) => {
    const validEventIds = await collectExistingEventIds(db, args.events);
    const data = { ...args, events: validEventIds };

    const existing = await db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      await db.patch(existing._id, data);
      return existing._id;
    }

    return await db.insert("users", data);
  }
});
