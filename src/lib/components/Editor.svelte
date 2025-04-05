<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Action } from 'svelte/action';

	interface Props {}

	let { content } = $props();
	let editorState = $state() as Editor;

	const editor: Action = (node) => {
		// the node has been mounted in the DOM

		$effect(() => {
			editorState = new Editor({
				element: node,
				extensions: [StarterKit],
				content: '<h1>Hi there</h1>',
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editorState = editorState;
				}
			});

			return () => {
				console.log(editorState.getJSON());
				editorState.destroy();
			};
		});
	};
</script>

<div use:editor class="prose border-border-input rounded-input mt-4 border p-4"></div>
