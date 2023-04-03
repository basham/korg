<script>
	import { onMount } from 'svelte';
	import { newGame } from '@src/actions.js';
	import { events } from '@src/events.js';
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
			return counter(foe.name, count);
		});
	}

	function getItems (event) {
		const { items = [] } = event;
		const inventory = count(items);
		return [...inventory.entries()].map(([id, count]) => {
			const item = shopItems.find((item) => item.id === id);
			return counter(item.name, count);
		})
	}

	function counter (name, count) {
		return `${name}${count > 1 ? ` [${count}]`: ''}`
	}
</script>

<main>
	<h1>Korg</h1>
	<dl>
		<dt>Health</dt>
		<dd>{event.health}</dd>
		<dt>Gold</dt>
		<dd>{event.gold}</dd>
		{#if event.location}
			<dt>Location</dt>
			<dd>{event.location.name}</dd>
		{/if}
		{#if items.length}
			<dt>Your items</dt>
			{#each items as item}
			<dd>{item}</dd>
			{/each}
		{/if}
		{#if defeatedFoes.length}
			<dt>Defeated foes</dt>
			{#each defeatedFoes as foe}
			<dd>{foe}</dd>
			{/each}
		{/if}
	</dl>
	<article aria-label="Current event" id="current-event" tabindex="-1">
		<svelte:component this={events[event.type]} />
	</article>
</main>

<style>
	main {
		display: grid;
		grid-template-areas:
			"header header"
			"stats events";
		grid-template-columns: 10rem 1fr;
		grid-template-rows: auto;
		margin: 0 auto;
		max-width: 40rem;
		padding: var(--size-8);
	}

	h1 {
		grid-area: header;
	}

	dl {
		grid-area: stats;
	}

	dt {
		font-weight: bold;
	}

	dt:not(:first-child) {
		margin-top: var(--size-4);
	}

	dd {
		color: var(--color-accent);
		font-size: var(--fs-2);
		margin: 0;
	}

	article {
		background-color: var(--color-bg-1);
		border-radius: var(--size-1);
		grid-area: events;
		padding: 0 var(--size-4) var(--size-4);
	}
</style>
