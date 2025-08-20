<script lang="ts">
	import { draggable } from '@thisux/sveltednd';
	import { fade } from 'svelte/transition';
	import { type Project, type Status } from '$lib/server/db/schema/project.sql';
	import { CheckCircle2, XCircle } from 'lucide-svelte';
	import { prettyDate } from '$lib/utils';
	import { renameProject, getProjects } from '$lib/projects.remote';
	import ProjectInfo from './ProjectInfo.svelte';
	import ProjectDelete from './ProjectDelete.svelte';

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
		interactive: ['button']
	}}
	in:fade={{ duration: 150 }}
	out:fade={{ duration: 150 }}
	class="bg-dark/10 w-full cursor-move rounded-xl border-2 p-4 text-left transition-all duration-200"
>
	<div class="group flex flex-col gap-2">
		{#if !edit}
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">
					{project.title}
				</h2>
				<div class="flex gap-1">
					<ProjectInfo {project} />
					<ProjectDelete projectId={project.id} />
				</div>
			</div>
		{:else}
			<form
				{...renameProject.enhance(async ({ submit, data }) => {
					submit().updates(
						getProjects().withOverride((p) =>
							p.map((prj) =>
								prj.id === Number(data.get('projectId'))
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
				<input type="hidden" value={project.id} name="projectId" />
				<div class="flex gap-1">
					<button type="button" class="opacity-50" onclick={() => (edit = false)}
						><XCircle class="active:scale-98" size={20} /></button
					>
					<button type="submit"><CheckCircle2 class="active:scale-98" size={20} /></button>
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
