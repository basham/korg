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
			['Pit trap', null, 3, 0],
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
			['Spike trap', null, 4, 'd6'],
			['Zombie', 2, 2, 1],
			['Ghoul', 2, 3, 2],
			['Ghost', 4, 2, 4],
			['Banshee', 3, 6, 7],
			['Lich', 5, 4, 10]
		]
	};

	const locations = [
		ruinLocation,
		catacombsLocation
	].map((location) => {
		const id = Symbol(location.label);
		const encounters = location.encounters.map(([label, defense, damage, gold]) =>
			({ label, defense, damage, gold, trap: defense === null })
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
		pushEvent(NEW_GAME, {
			gold: GOLD,
			health: HEALTH
		});
	}

	function travel () {
		pushEvent(TRAVEL);
	}

	function travelToLocation (id) {
		pushEvent(TRAVEL_TO_LOCATION, {
			location: id,
			getLocation: () => locations.find((location) => location.id === id)
		});
	}

	function explore () {
		const { encounters } = event.getLocation();
		const result = roll(encounters.length);
		const encounter = encounters[result - 1];
		const type = encounter.trap ? ENCOUNTER_TRAP : ENCOUNTER_FOE;
		pushEvent(type, {
			encounter,
			result
		});
	}

	function encounterTrap () {
		const { damage, gold } = event.encounter;
		const result = gold === 'd6' ? roll() : 0;
		pushEvent(TAKE_DAMAGE_FROM_TRAP, {
			gold: event.gold + result,
			health: event.health - damage,
			result
		});
	}

	function encounterFoe () {
		const result = roll();
		const { damage, defense, gold } = event.encounter;
		if (result > defense) {
			pushEvent(DEFEAT_FOE, {
				gold: event.gold + gold,
				result
			});
		} else {
			pushEvent(TAKE_DAMAGE_FROM_FOE, {
				health: event.health - damage,
				result
			});
		}
	}

	function roll (max = 6) {
		return Math.ceil(Math.random() * max);
	}

	function pushEvent (type, details) {
		const nextEvent = {
			...event,
			createdAt: new Date(),
			type,
			...details
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
			.reduce((map, { encounter }) => {
				const { label } = encounter;
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
			<p>You encounter {getArticle(event.encounter.label)} <strong>{event.encounter.label}</strong>.</p>
			<p><strong>Roll {event.encounter.defense + 1}{event.encounter.defense + 1 < 6 ? '+' : ''}</strong> to defeat the foe and gain <strong>{event.encounter.gold} gold</strong>.<br>Otherwise, take <strong>{event.encounter.damage} damage</strong>.</p>
			<p><button on:click={encounterFoe}>Fight</button></p>
		{/if}
		{#if event.type === ENCOUNTER_TRAP}
			<p>You encounter {getArticle(event.encounter.label)} <strong>{event.encounter.label}</strong>.</p>
			<p><button on:click={encounterTrap}>Continue</button></p>
		{/if}
		{#if event.type === DEFEAT_FOE}
			<p>You <strong>rolled {event.result}</strong> and defeat the <strong>{event.encounter.label}</strong>.</p>
			<p>Gain <strong>{event.encounter.gold} gold</strong>.</p>
			<p><button on:click={explore}>Explore</button></p>
		{/if}
		{#if event.type === TAKE_DAMAGE_FROM_FOE}
			<p>You <strong>rolled {event.result}</strong> and take <strong>{event.encounter.damage} damage</strong> from the <strong>{event.encounter.label}</strong>.</p>
			{#if event.health <= 0}
				<p>You die.</p>
				<p><button on:click={newGame}>New game</button></p>
			{:else}
				<p><button on:click={explore}>Explore</button></p>
			{/if}
		{/if}
		{#if event.type === TAKE_DAMAGE_FROM_TRAP}
			<p>Take <strong>{event.encounter.damage} damage</strong> from the <strong>{event.encounter.label}</strong>.</p>
			{#if event.encounter.gold === 'd6'}
				<p>You discover <strong>{event.result} gold</strong>.</p>
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
