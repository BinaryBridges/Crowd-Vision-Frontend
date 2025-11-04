<script context="module" lang="ts">
	export type Status = 'In Progress' | 'Finished' | 'Uploading' | 'Failed';
</script>

<script lang="ts">
	const STATUSES = ['Uploading', 'In Progress', 'Finished', 'Failed'] as const;
	const STATUS_SET = new Set<string>(STATUSES as readonly string[]);

	const statusStyles: Record<Status, string> = {
		'In Progress':
			'bg-[var(--color-orange-50)] text-[var(--color-orange-500)] border-[var(--color-orange-500)]',
		Finished:
			'bg-[var(--color-green-50)] text-[var(--color-green-600)] border-[var(--color-green-600)]',
		Uploading:
			'bg-[var(--color-grey-50)] text-[var(--color-black-300)] border-[var(--color-black-300)]',
		Failed: 'bg-[var(--color-red-50)] text-[var(--color-red-500)] border-[var(--color-red-500)]'
	};

	type EventLike = { status: Status | (string & {}) };
	type T = $$Generic<EventLike>;
	export let item: T;

	$: statusClass = STATUS_SET.has(String(item.status)) ? statusStyles[item.status as Status] : '';
</script>

<span
	class={'inline-flex items-center rounded-[var(--radius-6)] border px-3 py-1 text-[12px] font-medium ' +
		statusClass}
>
	{item.status}
</span>
