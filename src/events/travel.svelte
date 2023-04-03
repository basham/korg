<script>
	import { travelTo } from '@src/actions.js';
	import { locations } from '@src/locations.js';
</script>

<p>Pick a location.</p>
<ul>
{#each locations as location}
	<li>
		<button on:click={() => travelTo(location.id)}>
			{location.name}
		</button>
	</li>
{/each}
</ul>
