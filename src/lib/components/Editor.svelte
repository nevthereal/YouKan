<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Action } from 'svelte/action';

	interface Props {
		content: string;
		projectId: number;
	}

	let { content, projectId }: Props = $props();
	let editorState = $state() as Editor;

	const saveNote = () => {
		fetch(`/api/notes/?id=${projectId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editorState.getJSON())
		});
	};

	// $effect(() => {
	// 	setInterval(saveNote, 5000);
	// });

	const editor: Action = (node) => {
		// the node has been mounted in the DOM

		$effect(() => {
			editorState = new Editor({
				element: node,
				extensions: [StarterKit],
				content: content
					? (() => {
							try {
								return JSON.parse(content);
							} catch (e) {
								console.error('Failed to parse editor content:', e);
								return {}; // Fallback to empty content
							}
						})()
					: {},
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editorState = editorState;
				}
			});

			return () => {
				editorState.destroy();
				saveNote();
			};
		});
	};
</script>

<div use:editor class="prose border-border-input rounded-input border p-4"></div>
