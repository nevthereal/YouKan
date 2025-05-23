<script lang="ts">
	import { draggable } from '@thisux/sveltednd';
	import { fade } from 'svelte/transition';
	import { type Project, type Status } from '$lib/server/db/schema/project.sql';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { zNewProject } from '$lib/zod';
	import { CheckCircle2, Sticker, Trash2, XCircle } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { prettyDate } from '$lib/utils';

	interface Props {
		prj: Project;
		status: Status[number];
		editForm: SuperValidated<Infer<typeof zNewProject>>;
	}

	let { prj, status, editForm }: Props = $props();
	let edit = $state(false);

	const { form, enhance } = superForm(editForm, {
		id: `edit-${prj.id}`,
		onSubmit: () => {
			edit = false;
		}
	});

	$form.title = prj.title;

	let input = $state() as HTMLInputElement;
</script>

<div
	ondblclick={() => {
		edit = true;
		setTimeout(() => {
			input.focus();
		}, 20);
	}}
	role="button"
	tabindex="0"
	use:draggable={{
		disabled: edit,
		container: status,
		dragData: prj,
		callbacks: {
			onDrop: (e) => {
				console.log(e.invalidDrop);
			}
		},
		interactive: ['a', 'button']
	}}
	in:fade={{ duration: 150 }}
	out:fade={{ duration: 150 }}
	class="bg-dark/10 rounded-card w-full cursor-move border-2 p-4 text-left transition-all duration-200"
>
	<div class="group flex flex-col gap-2">
		{#if !edit}
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">
					{prj.title}
				</h2>
				<div class="flex gap-1">
					<a
						title="Notes"
						aria-label="Notes"
						href="/project/{prj.id}"
						class="invisible group-hover:visible"><Sticker size={20} /></a
					>
					<button
						onclick={async () => {
							await fetch(`/api/delete?id=${prj.id}`, {
								method: 'POST'
							}).then(() => invalidateAll());
						}}
						title="Delete"
						aria-label="Delete"
						class="invisible group-hover:visible hover:text-red-500"><Trash2 size={20} /></button
					>
				</div>
			</div>
		{:else}
			<form use:enhance action="/?/edit" method="post" class="flex">
				<input
					bind:this={input}
					name="title"
					bind:value={$form.title}
					class="w-full text-xl outline-none"
					type="text"
				/>
				<div class="flex gap-1">
					<button type="button" class="opacity-50" onclick={() => (edit = false)}
						><XCircle /></button
					>
					<button type="submit"><CheckCircle2 /></button>
				</div>
			</form>
		{/if}
		{#if prj.date}
			<h3>
				{prettyDate(prj.date, 'medium')}
			</h3>
		{/if}
	</div>
</div>
