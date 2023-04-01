<script context="module">
	import { currentEvent, pushEvent } from '@src/log.js';
	import { idle } from './idle.svelte';

	export const id = Symbol('travel to');

	export function travelTo(location) {
		pushEvent(id, { location });
	}
</script>

<p>You enter the {$currentEvent.location.name}.</p>
<p><button on:click={idle}>Continue</button></p>
