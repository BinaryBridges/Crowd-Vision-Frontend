import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
	handler: async ({ db }) => {
		const clients = await db.query('clients').collect();
		return clients.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const getByName = query({
	args: { name: v.string() },
	handler: async ({ db }, { name }) => {
		return await db
			.query('clients')
			.withIndex('by_name', (q) => q.eq('name', name))
			.unique();
	}
});

export const getById = query({
	args: { id: v.id('clients') },
	handler: async ({ db }, { id }) => {
		return await db.get(id);
	}
});

export const save = mutation({
	args: {
		name: v.string(),
		company: v.string(),
		representative: v.string(),
		logo: v.string()
	},
	handler: async ({ db }, args) => {
		const existing = await db
			.query('clients')
			.withIndex('by_name', (q) => q.eq('name', args.name))
			.unique();

		if (existing) {
			await db.patch(existing._id, {
				company: args.company,
				representative: args.representative,
				logo: args.logo
			});
			return existing._id;
		}

		return await db.insert('clients', args);
	}
});

export const remove = mutation({
	args: { id: v.id('clients') },
	handler: async ({ db }, { id }) => {
		await db.delete(id);
	}
});
