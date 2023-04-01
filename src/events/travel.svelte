<script>
	import { travelTo } from '@src/actions.js';
	import { locations } from '@src/locations.js';
</script>

<p>Pick a location.</p>
{#each locations as location}
	<p>
		<button on:click={() => travelTo(location.id)}>
			{location.name}
		</button>
	</p>
{/each}
