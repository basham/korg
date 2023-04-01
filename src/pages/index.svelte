<script>
	import { onMount } from 'svelte';
	import Layout from './layout.svelte';

	const NEW_GAME = Symbol('new game');
	const TRAVEL = Symbol('travel');
	const TRAVEL_TO_LOCATION = Symbol('travel to location');
	const ENCOUNTER_FOE = Symbol('encounter foe');
	const ENCOUNTER_TRAP = Symbol('encounter trap');
	const DEFEAT_FOE = Symbol('defeat foe');
	const TAKE_DAMAGE_FROM_FOE = Symbol('take damage from foe');
	const TAKE_DAMAGE_FROM_TRAP = Symbol('take damage from trap');

	const GOLD = 0;
	const HEALTH = 20;

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
			['Spike trap', 0, 4, 'd6'],
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
			['Slime', 4, 0, 'd6'],
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
			['Pendulumn trap', 0, 'd6', 0],
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

	let log = [];
	$: event = log.at(-1) || {};

	onMount(() => {
		newGame();
	});

	function newGame () {
		log = [];
		const gold = GOLD;
		const health = HEALTH;
		const location = null;
		pushEvent(NEW_GAME, { gold, health, location });
	}

	function travel () {
		pushEvent(TRAVEL);
	}

	function travelToLocation (location) {
		pushEvent(TRAVEL_TO_LOCATION, { location });
	}

	function explore () {
		const { encounters } = event.getLocation();
		const result = roll(encounters.length);
		const encounter = encounters[result - 1];
		if (encounter.attack === 0) {
			const trap = encounter;
			pushEvent(ENCOUNTER_TRAP, { trap });
		} else {
			const foe = encounter;
			pushEvent(ENCOUNTER_FOE, { foe });
		}
	}

	function encounterTrap () {
		const { trap } = event;
		const { damage, gold } = trap;
		const gainGold = gold === 'd6' ? roll() : 0;
		const takeDamage = damage === 'd6' ? roll() : damage;
		pushEvent(TAKE_DAMAGE_FROM_TRAP, { gainGold, takeDamage, trap });
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

	function roll (max = 6) {
		return Math.ceil(Math.random() * max);
	}

	function pushEvent (type, details = {}) {
		const {
			gainGold = 0,
			gold = event.gold,
			heal = 0,
			health = event.health,
			location = event.location,
			takeDamage = 0
		} = details;
		const getLocation = () => locations.find((l) => l.id === location)
		const nextEvent = {
			...details,
			createdAt: new Date(),
			getLocation,
			gold: gold + gainGold,
			health: health - takeDamage + heal,
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
</script>

<Layout>
	<h1>Korg</h1>
	<p class="status">{event.health} health<br>{event.gold} gold</p>
	{#if event.location}
		<p>Location: {event.getLocation().label || '(none)'}</p>
	{/if}
	{#if defeatedFoes(log).length}
		<p>Defeated foes: {defeatedFoes(log).join(', ')}</p>
	{/if}
	<article aria-label="Current event" class="event" id="current-event" tabindex="-1">
		{#if event.type === NEW_GAME}
			<p>You are an adventurer.</p>
			<p><button on:click={travel}>Start traveling</button></p>
		{/if}
		{#if event.type === TRAVEL}
			<p>Pick a location.</p>
			{#each locations as location}
				<p><button on:click={() => travelToLocation(location.id)}>{location.label}</button></p>
			{/each}
		{/if}
		{#if event.type === TRAVEL_TO_LOCATION}
			<p>You enter the {event.getLocation().label}.</p>
			<p><button on:click={explore}>Explore</button></p>
		{/if}
		{#if event.type === ENCOUNTER_FOE}
			<p>You encounter {getArticle(event.foe.label)} <strong>{event.foe.label}</strong>.</p>
			<p><strong>Roll {event.foe.attack + 1}{event.foe.attack + 1 < 6 ? '+' : ''}</strong> to defeat the foe and gain <strong>{event.foe.gold} gold</strong>.<br>Otherwise, take <strong>{event.foe.damage} damage</strong>.</p>
			<p><button on:click={encounterFoe}>Fight</button></p>
		{/if}
		{#if event.type === ENCOUNTER_TRAP}
			<p>You encounter {getArticle(event.trap.label)} <strong>{event.trap.label}</strong>.</p>
			<p><button on:click={encounterTrap}>Continue</button></p>
		{/if}
		{#if event.type === DEFEAT_FOE}
			<p>You <strong>rolled {event.attack}</strong> and defeat the <strong>{event.foe.label}</strong>.</p>
			<p>Gain <strong>{event.gainGold} gold</strong>.</p>
			<p><button on:click={explore}>Explore</button></p>
		{/if}
		{#if event.type === TAKE_DAMAGE_FROM_FOE}
			<p>You <strong>rolled {event.attack}</strong> and take <strong>{event.takeDamage} damage</strong> from the <strong>{event.foe.label}</strong>.</p>
			{#if event.health <= 0}
				<p>You die.</p>
				<p><button on:click={newGame}>New game</button></p>
			{:else}
				<p><button on:click={explore}>Explore</button></p>
			{/if}
		{/if}
		{#if event.type === TAKE_DAMAGE_FROM_TRAP}
			<p>Take <strong>{event.takeDamage} damage</strong> from the <strong>{event.trap.label}</strong>.</p>
			{#if event.gainGold}
				<p>You discover <strong>{event.gainGold} gold</strong>.</p>
			{/if}
			{#if event.health <= 0}
				<p>You die.</p>
				<p><button on:click={newGame}>New game</button></p>
			{:else}
				<p><button on:click={explore}>Explore</button></p>
			{/if}
		{/if}
	</article>
</Layout>

<style>
	.event {
		border-top: var(--px-2) solid var(--color-base-5);
	}
</style>
