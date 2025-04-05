<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Action } from 'svelte/action';
	import { PersistedState } from 'runed';

	const content = new PersistedState('content', 'Type content here');

	let editorState = $state() as Editor;

	const editor: Action = (node) => {
		// the node has been mounted in the DOM

		$effect(() => {
			editorState = new Editor({
				element: node,
				extensions: [StarterKit],
				content: content.current,
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editorState = editorState;
				}
			});

			return () => {
				editorState.destroy();
			};
		});
	};
</script>

<div use:editor class="prose border-border-input rounded-input mt-4 border p-4"></div>
