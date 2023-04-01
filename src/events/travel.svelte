<script context="module">
	import { locations } from '@src/locations.js';
	import { pushEvent } from '@src/log.js';
	import { travelTo } from './travel-to.svelte';

	export const id = Symbol('travel');

	export function travel () {
		pushEvent(id);
	}
</script>

<p>Pick a location.</p>
{#each locations as location}
	<p>
		<button on:click={() => travelTo(location.id)}>
			{location.name}
		</button>
	</p>
{/each}
