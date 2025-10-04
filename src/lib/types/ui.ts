import type { Component } from 'svelte';

export type Crumb = {
	label: string;
	href?: string;
	Icon?: Component;
};
