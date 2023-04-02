<script>
	import { onMount } from 'svelte';
	import { events as allEvents } from '@src/events.js';
	import { newGame } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
	import { shopItems } from '@src/shop.js';
	import { count } from '@src/util.js';

	$: event = $currentEvent;
	$: defeatedFoes = getDefeatedFoes($currentEvent);
	$: items = getItems($currentEvent);

	currentEvent.subscribe(() => {
		document.getElementById('current-event')?.focus();
	});

	onMount(() => {
		newGame();
	});

	function getDefeatedFoes (event) {
		const { defeatedFoes = [], location } = event;
		const foes = count(defeatedFoes);
		return [...foes.entries()].map(([id, count]) => {
			const foe = location.encounters.find((encounter) => encounter.id === id);
			const { name } = foe;
			return `${name} (${count})`;
		});
	}

	function getItems (event) {
		const { items = [] } = event;
		const inventory = count(items);
		return [...inventory.entries()].map(([id, count]) => {
			const item = shopItems.find((item) => item.id === id);
			return { ...item, count };
		})
	}
</script>

<main>
	<h1>Korg</h1>
	<p class="status">{event.health} health<br>{event.gold} gold</p>
	{#if items.length}
		<p>Items:</p>
		<ul>
			{#each items as item}
				<li><strong>{`${item.name}${item.count > 1 ? ` [${item.count}]`: ''}`}:</strong> {item.description}</li>
			{/each}
		</ul>
	{/if}
	{#if event.location}
		<p>Location: {event.location.name}</p>
	{/if}
	{#if defeatedFoes.length}
		<p>Defeated foes: {defeatedFoes.join(', ')}</p>
	{/if}
	<article aria-label="Current event" class="event" id="current-event" tabindex="-1">
		<svelte:component this={allEvents[event.type]} />
	</article>
</main>

<style>
	main {
		margin: 0 auto;
		max-width: 40rem;
		padding: var(--size-8);
	}

	.event {
		border-top: var(--px-2) solid var(--color-base-5);
	}
</style>
