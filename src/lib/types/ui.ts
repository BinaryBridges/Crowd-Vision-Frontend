import type { Component } from 'svelte';

export interface TableColumn<T extends Record<string, unknown>> {
	key: string;
	label: string;
	sortable?: boolean;
	render?: (item: T) => string;
	component?: Component<{ item: T }>;
	width?: string;
}

export interface TableTab {
	label: string;
	value: string;
	count?: number;
}

export interface Crumb {
	label: string;
	href?: string;
	Icon?: Component;
}

export interface Event {
	id: string;
	name: string;
	company: string;
	logo: string;
	color: string;
	representative: string;
	eventDate: string;
	analysisDate: string;
	status: 'In Progress' | 'Finished' | 'Draft' | 'Overdue';
	isFavorite: boolean;
}
