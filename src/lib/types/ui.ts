import type { Component } from 'svelte';
import type { Pathname } from '$app/types';

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
	href?: Pathname;
	Icon?: Component;
}
