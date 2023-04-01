<script>
	import { onMount } from 'svelte';
	import Layout from './layout.svelte';
	import { events as allEvents } from '@src/events.js';
	import { newGame } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';

	const IDLE = Symbol('idle');
	const ENCOUNTER_FOE = Symbol('encounter foe');
	const ENCOUNTER_TRAP = Symbol('encounter trap');
	const DEFEAT_FOE = Symbol('defeat foe');
	const TAKE_DAMAGE_FROM_FOE = Symbol('take damage from foe');
	const TAKE_DAMAGE_FROM_TRAP = Symbol('take damage from trap');
	const SHOP = Symbol('shop');
	const BUY_ITEM = Symbol('buy item');
	const USE_ITEM = Symbol('use item');

	const ROLL = Symbol('roll');

	const ruinLocation = {
		label: 'Ruins',
		encounters: [
			['Pit trap', 0, 3, 0],
			['Skeleton', 2, 2, 1],
			['Goblin', 3, 2, 2],
			['Wraith', 5, 2, 4],
			['Ogre', 4, 4, 7],
			['Demon', 4, 6, 10]
		]
	};

	const catacombsLocation = {
		label: 'Catacombs',
		encounters: [
			['Spike trap', 0, 4, ROLL],
			['Zombie', 2, 2, 1],
			['Ghoul', 2, 3, 2],
			['Ghost', 4, 2, 4],
			['Banshee', 3, 6, 7],
			['Lich', 5, 4, 10]
		]
	};

	const fetidSwampLocation = {
		label: 'Fetid Swamp',
		encounters: [
			['Acid trap', 0, 0, -4],
			['Croaker', 1, 3, 0],
			['Snakefolk', 3, 3, 4],
			['Slime', 4, 0, ROLL],
			['Shaman', 4, 3, 6],
			['Basilisk', 3, 8, 12]
		]
	};

	const darkTowerLocation = {
		label: 'Dark Tower',
		encounters: [
			['Crow', 2, 1, 0],
			['Guard', 3, 2, 1],
			['Gargoyle', 4, 2, 3],
			['Werewolf', 3, 4, 5],
			['Pendulumn trap', 0, ROLL, 0],
			['Vampire', 5, 5, 11]
		]
	};

	const locations = [
		ruinLocation,
		catacombsLocation,
		fetidSwampLocation,
		darkTowerLocation
	].map((location) => {
		const id = Symbol(location.label);
		const encounters = location.encounters.map(([label, attack, damage, gold]) =>
			({ label, attack, damage, gold })
		);
		return { ...location, id, encounters };
	});

	const ITEM_SINGLE_USE = Symbol('item single use');
	const ITEM_MULTI_USE = Symbol('item multi-use');

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

	let event

	currentEvent.subscribe((e) => {
		event = e;
		console.log('E', e)
		document.getElementById('current-event')?.focus();
	});

	let log = [];
	//$: event = log.at(-1) || {};
	$: shopInventory = getShopInventory(event);

	onMount(() => {
		newGame();
	});

	function idle () {
		pushEvent(IDLE);
	}

	function encounterFoe () {
		const attack = roll();
		const { foe } = event;
		if (attack > foe.attack) {
			const gainGold = foe.gold;
			pushEvent(DEFEAT_FOE, { attack, foe, gainGold });
		} else {
			const takeDamage = foe.damage;
			pushEvent(TAKE_DAMAGE_FROM_FOE, { attack, foe, takeDamage });
		}
	}

	function shop () {
		pushEvent(SHOP);
	}

	function buyItem (item) {
		const getItem = () => shopItems.find((i) => i.id === item);
		const changeItems = (items) => [...items, item];
		const { cost } = getItem();
		const gainGold = cost * -1;
		pushEvent(BUY_ITEM, { gainGold, getItem, item, changeItems });
	}

	function useItem (item) {
		const changeItems = (items) => {
			const index = items.indexOf(item);
			return index === -1 ? items : items.splice(index, 1);
		}
		pushEvent(USE_ITEM, { item, changeItems });
	}

	function roll (max = 6) {
		return Math.ceil(Math.random() * max);
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

	function getShopInventory () {
		const { items = [] } = event;
		const alreadyPurchased = items
			.filter(({ useType }) => useType === ITEM_MULTI_USE)
			.map(({ id }) => id);
		const availableItems = shopItems
			.filter(({ id, useType }) => useType === ITEM_SINGLE_USE || (useType === ITEM_MULTI_USE && !alreadyPurchased.includes(id)));
		const affordable = availableItems
			.filter(({ cost }) => cost <= event.gold);
		const other = availableItems
			.filter(({ cost }) => cost > event.gold);
		return { affordable, other }
	}
</script>

<Layout>
	<h1>Korg</h1>
	<p class="status">{event.health} health<br>{event.gold} gold</p>
	{#if getItems(event).length}
		<p>Items:</p>
		<ul>
			{#each getItems(event) as item}
				<li><strong>{`${item.label}${item.count > 1 ? ` [${item.count}]`: ''}`}:</strong> {item.description}</li>
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
		{#if event.type === ENCOUNTER_FOE}
			<p>You encounter {getArticle(event.foe.label)} <strong>{event.foe.label}</strong>.</p>
			<p><strong>Roll {event.foe.attack + 1}{event.foe.attack + 1 < 6 ? '+' : ''}</strong> to defeat the foe and gain <strong>{event.foe.gold} gold</strong>.<br>Otherwise, take <strong>{event.foe.damage} damage</strong>.</p>
			<p><button on:click={encounterFoe}>Attack</button></p>
		{/if}
		{#if event.type === DEFEAT_FOE}
			<p>You <strong>rolled {event.attack}</strong> and defeat the <strong>{event.foe.label}</strong>.</p>
			<p>Gain <strong>{event.gainGold} gold</strong>.</p>
			<p><button on:click={idle}>Continue</button></p>
		{/if}
		{#if event.type === TAKE_DAMAGE_FROM_FOE}
			<p>You <strong>rolled {event.attack}</strong> and take <strong>{event.takeDamage} damage</strong> from the <strong>{event.foe.label}</strong>.</p>
			{#if event.health <= 0}
				<p>You die.</p>
				<p><button on:click={newGame}>New game</button></p>
			{:else}
				<p><button on:click={idle}>Continue</button></p>
			{/if}
		{/if}
		{#if event.type === SHOP}
			<p>You enter the shop.</p>
			{#if shopInventory.affordable.length}
				<p>What would you like to buy?</p>
				<ul>
				{#each shopInventory.affordable as item}
					<li>
						<strong>{item.label}:</strong>
						{item.description}
						Costs {item.cost} gold.
						<button on:click={() => buyItem(item.id)}>Buy<span class="u-sr-only"> {item.label}</span></button>
					</li>
				{/each}
				</ul>
			{:else}
				<p>Everything is too expensive.</p>
			{/if}
			<p>Browse other items:</p>
			<ul>
			{#each shopInventory.other as item}
				<li><strong>{item.label}:</strong> {item.description} Costs {item.cost} gold.</li>
			{/each}
			</ul>
			<p><button on:click={idle}>Exit shop</button></p>
		{/if}
		{#if event.type === BUY_ITEM}
			{@const { label } = event.getItem()}
			<p>You purchased {getArticle(label)} <strong>{label}</strong>.</p>
			<p><button on:click={idle}>Continue</button></p>
		{/if}
	</article>
</Layout>

<style>
	.event {
		border-top: var(--px-2) solid var(--color-base-5);
	}
</style>
