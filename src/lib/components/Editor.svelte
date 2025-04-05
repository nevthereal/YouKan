<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Action } from 'svelte/action';

	let editorState = $state() as Editor;

	const editor: Action = (node) => {
		// the node has been mounted in the DOM

		$effect(() => {
			editorState = new Editor({
				element: node,
				extensions: [StarterKit],
				content: '<p>Hello World! 🌍️ </p>',
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

<div use:editor></div>
