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
	<div class="section">
		<div>
			<h1>Korg</h1>
		</div>
	</div>
	<div class="section header">
		<div>
			<ul class="character">
				<li class="grow">
					<div class="spread">
						<div>Health</div>
						<div><span class="accent">{event.health}</span><small>/20</small></div>
					</div>
					<div class="meter" style="--value: {`${event.health / 20 * 100}%`};"></div>
				</li>
				<li class="grow">
					<div class="spread">
						<div>Gold</div>
						<div><span class="accent">{event.gold}</span><small>/50</small></div>
					</div>
					<div class="meter" style="--value: {`${event.gold / 50 * 100}%`};"></div>
				</li>
				<li>
					<button>Items (3)</button>
				</li>
				<li>
					<button>Stats</button>
				</li>
			</ul>
		</div>
	</div>
	<div class="section">
		<article aria-label="Current event" id="current-event" tabindex="-1">
			<svelte:component this={events[event.type]} />
		</article>
	</div>
	<div class="section">
		<div>
			<dl>
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
		</div>
	</div>
</main>

<style>
	.section > * {
		margin: 0 auto;
		max-width: 36rem;
		padding: 0 var(--size-4);
	}

	h1 {
		padding: var(--size-4) 0;
	}

	.header {
		background-color: var(--color-bg-2);
		padding: var(--size-1) 0;
	}

	dl {
		margin-top: 4rem;
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
		padding-top: var(--size-4);
	}

	ul.character {
		display: flex;
		flex-wrap: wrap;
		gap: 1em 2em;
		justify-content: center;
		list-style-type: "";
		margin: var(--size-2) 0;
		padding: 0;
	}

	ul.character li {
		margin: 0;
	}

	.grow {
		flex-grow: 1;
	}

	.spread {
		display: flex;
		gap: var(--size-4);
		justify-content: space-between;
	}

	.accent {
		color: var(--color-accent);
	}

	small {
		font-size: var(--fs-0);
	}

	.meter {
		background-color: var(--color-bg-0);
		border: var(--px-1) solid var(--color-text);
		border-radius: var(--size-1);
		height: 0.75em;
		padding: var(--px-2);
		margin-top: var(--size-2);
	}

	.meter::before {
		background-color: var(--color-link);
		content: "";
		display: block;
		height: 100%;
		width: var(--value);
	}
</style>
