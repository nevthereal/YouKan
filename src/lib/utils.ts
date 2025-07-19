import { error } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function checkId(id: string | number) {
	const idToCheck = Number(id);

	if (!Number.isNaN(idToCheck)) return idToCheck;

	return error(400);
}

export function prettyDate(date: Date, format: 'long' | 'medium') {
	return Intl.DateTimeFormat('en', { dateStyle: format }).format(date);
}

export const STATUS_VALUES = ['To Do', 'Re Record', 'In Progress', 'Done', 'Scrap'] as const;
