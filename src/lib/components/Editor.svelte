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

	let saveTimeout: NodeJS.Timeout;
	const SAVE_DELAY = 1000; // 1 second delay

	const debouncedSave = () => {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveNote, SAVE_DELAY);
	};

	$effect(() => {
		return () => {
			clearTimeout(saveTimeout);
		};
	});

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
					debouncedSave();
				}
			});

			return () => {
				editorState.destroy();
				if (editorState.isEmpty) return;
				saveNote();
			};
		});
	};
</script>

<div use:editor class="prose border-border-input rounded-input border p-4"></div>
