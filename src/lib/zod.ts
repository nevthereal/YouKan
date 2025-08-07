import { z } from 'zod';

export const zNewProject = z.object({
	title: z.string().min(3)
});
export const zEditProject = z.object({
	title: z.string().min(3),
	projectId: z.string().transform((v) => Number(v))
});

export const zSetDate = z.object({
	date: z.date().nullable()
});
