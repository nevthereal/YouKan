<script lang="ts">
	import { draggable } from '@thisux/sveltednd';
	import { fade } from 'svelte/transition';
	import { type Project, type Status } from '$lib/server/db/schema/project.sql';
	import { CheckCircle2, Sticker, Trash2, XCircle } from 'lucide-svelte';
	import { prettyDate } from '$lib/utils';
	import { deleteProject, editProject, getProjects } from '$lib/projects.remote';
	import { toast } from 'svelte-sonner';

	interface Props {
		project: Project;
		status: Status[number];
	}

	let { project, status }: Props = $props();
	let edit = $state(false);

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
		dragData: project,
		callbacks: {
			onDrop: (e) => {
				console.log(e.invalidDrop);
			}
		},
		interactive: ['#notes', '#delete']
	}}
	in:fade={{ duration: 150 }}
	out:fade={{ duration: 150 }}
	class="bg-dark/10 rounded-card w-full cursor-move border-2 p-4 text-left transition-all duration-200"
>
	<div class="group flex flex-col gap-2">
		{#if !edit}
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">
					{project.title}
				</h2>
				<div class="flex gap-1">
					<a
						id="notes"
						title="Notes"
						aria-label="Notes"
						href="/project/{project.id}"
						class="invisible group-hover:visible"><Sticker size={20} /></a
					>
					<button
						onclick={async () => {
							toast.promise(
								deleteProject(project.id).updates(
									getProjects().withOverride((p) => p.filter((prj) => prj.id !== project.id))
								),
								{
									loading: 'Deleting project...',
									success: `${project.title} deleted`,
									error: 'Failed to delete project'
								}
							);
						}}
						id="delete"
						title="Delete"
						aria-label="Delete"
						class="invisible group-hover:visible hover:text-red-500"><Trash2 size={20} /></button
					>
				</div>
			</div>
		{:else}
			<form
				{...editProject.enhance(async ({ submit, data }) => {
					submit().updates(
						getProjects().withOverride((p) =>
							p.map((prj) =>
								prj.id === Number(data.get('id'))
									? { ...prj, title: data.get('title') as string }
									: prj
							)
						)
					);
					edit = false;
				})}
				class="flex"
			>
				<input
					defaultValue={project.title}
					bind:this={input}
					name="title"
					class="w-full text-xl outline-none"
					type="text"
				/>
				<input type="hidden" value={project.id} name="id" />
				<div class="flex gap-1">
					<button type="button" class="opacity-50" onclick={() => (edit = false)}
						><XCircle /></button
					>
					<button type="submit"><CheckCircle2 /></button>
				</div>
			</form>
		{/if}
		{#if project.date}
			<h3>
				{prettyDate(project.date, 'medium')}
			</h3>
		{/if}
	</div>
</div>
