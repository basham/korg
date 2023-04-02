<script>
	import { onMount } from 'svelte';
	import Layout from './layout.svelte';
	import { events as allEvents } from '@src/events.js';
	import { newGame } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
	import { shopItems } from '@src/shop.js';

	const IDLE = Symbol('idle');
	const DEFEAT_FOE = Symbol('defeat foe');
	const BUY_ITEM = Symbol('buy item');
	const USE_ITEM = Symbol('use item');

	/*
	const shopItems = [
		['Rope', 2, 'Avoid trap once.', ITEM_SINGLE_USE, [ENCOUNTER_TRAP]],
		['Caltrops', 2, 'Flee foe once.', ITEM_SINGLE_USE, [ENCOUNTER_FOE]],
		['Shield', 3, 'Avoid damage once.', ITEM_SINGLE_USE, [ENCOUNTER_FOE, ENCOUNTER_TRAP]],
		['Potion', 4, 'Heal d6 health.', ITEM_SINGLE_USE, [IDLE]],
		['Lithe boots', 4, 'Roll 3+ to flee foe.', ITEM_MULTI_USE, [ENCOUNTER_FOE]],
		['Sword', 5, '+1 attack.', ITEM_MULTI_USE, []],
		['High potion', 7, 'Heal 2d6 health.', ITEM_SINGLE_USE, [ENCOUNTER_FOE, ENCOUNTER_TRAP, IDLE]],
		['Death scroll', 8, 'Defeat one foe.', ITEM_SINGLE_USE, [ENCOUNTER_FOE]],
		['Armor', 10, '-1 damage.', ITEM_MULTI_USE, []]
	].map(([label, cost, description, useType, eventTypes, ]) => ({
		id: Symbol(label), label, cost, description, useType, eventTypes
	}));
	*/

	let event

	currentEvent.subscribe((e) => {
		event = e;
		document.getElementById('current-event')?.focus();
	});

	let log = [];
	//$: event = log.at(-1) || {};

	onMount(() => {
		newGame();
	});

	function idle () {
		pushEvent(IDLE);
	}

	function useItem (item) {
		const changeItems = (items) => {
			const index = items.indexOf(item);
			return index === -1 ? items : items.splice(index, 1);
		}
		pushEvent(USE_ITEM, { item, changeItems });
	}

	function pushEvent (type, details = {}) {
		const {
			changeItems = (i) => i,
			gainGold = 0,
			gold = event.gold,
			heal = 0,
			health = event.health,
			items = (event.items || []),
			location = event.location,
			takeDamage = 0
		} = details;
		const getLocation = () => locations.find((l) => l.id === location);
		const nextEvent = {
			...details,
			createdAt: new Date(),
			getLocation,
			gold: gold + gainGold,
			health: health - takeDamage + heal,
			items: changeItems(items),
			location,
			type
		};
		log = [...log, nextEvent];
		document.getElementById('current-event').focus();
	}

	function getArticle (noun) {
		const firstLetter = noun.toLowerCase()[0];
		return 'aeiou'.includes(firstLetter) ? 'an' : 'a';
	}

	function defeatedFoes (log) {
		const foes = log
			.filter(({ type }) => type === DEFEAT_FOE)
			.reduce((map, { foe }) => {
				const { label } = foe;
				if (!map.has(label)) {
					map.set(label, 0);
				}
				map.set(label, map.get(label) + 1);
				return map;
			}, new Map());
		return [...foes.entries()]
			.map(([label, count]) => `${label} (${count})`);
	}

	function getItems (event) {
		const { items = [] } = event;
		const inventory = items.reduce((map, item) => {
			if (!map.has(item)) {
				map.set(item, 0);
			}
			map.set(item, map.get(item) + 1);
			return map;
		}, new Map());
		return [...inventory.entries()].map(([id, count]) => {
			const item = shopItems.find((item) => item.id === id);
			return { ...item, count };
		})
	}
</script>

<Layout>
	<h1>Korg</h1>
	<p class="status">{event.health} health<br>{event.gold} gold</p>
	{#if getItems(event).length}
		<p>Items:</p>
		<ul>
			{#each getItems(event) as item}
				<li><strong>{`${item.name}${item.count > 1 ? ` [${item.count}]`: ''}`}:</strong> {item.description}</li>
			{/each}
		</ul>
	{/if}
	{#if event.location}
		<p>Location: {event.location.name}</p>
	{/if}
	{#if defeatedFoes(log).length}
		<p>Defeated foes: {defeatedFoes(log).join(', ')}</p>
	{/if}
	<article aria-label="Current event" class="event" id="current-event" tabindex="-1">
		<svelte:component this={allEvents[event.type]} />
	</article>
</Layout>

<style>
	.event {
		border-top: var(--px-2) solid var(--color-base-5);
	}
</style>
