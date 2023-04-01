<script>
	import { onMount } from 'svelte';
	import Layout from './layout.svelte';

	const IDLE = Symbol('idle');
	const EXPLORE = Symbol('explore');
	const SHOP = Symbol('shop');

	const NEW_GAME = Symbol('new game');
	const ENCOUNTER = Symbol('encounter');
	const FIGHT = Symbol('fight');

	let log = [];
	$: event = log.at(-1) || {};

	onMount(() => {
		newGame();
	});

	function newGame () {
		log = [];
		pushEvent(NEW_GAME, {
			gold: 0,
			health: 20
		});
	}

	function shop () {
		state = SHOP;
	}

	const location = {
		label: 'Ruin',
		encounters: [
			['Spike trap', null, 3, 0],
			['Skeleton', 2, 2, 1],
			['Goblin', 3, 2, 2],
			['Wraith', 5, 2, 4],
			['Ogre', 4, 4, 7],
			['Demon', 4, 6, 10]
		].map(([label, defense, damage, gold]) =>
			({ label, defense, damage, gold, trap: defense === null })
		)
	}

	function explore () {
		const result = roll();
		const encounter = location.encounters[result - 1];
		pushEvent(ENCOUNTER, {
			encounter,
			result,
			location
		});
	}

	function fight () {
		const result = roll();
		const { encounter } = event;
		const win = encounter.defense !== null && result > encounter.defense;
		const goldDiff = win ? encounter.gold : 0;
		const healthDiff = win ? 0 : encounter.damage;
		pushEvent(FIGHT, {
			encounter,
			gold: event.gold + goldDiff,
			goldDiff,
			health: event.health - healthDiff,
			healthDiff,
			result,
			win
		});
	}

	function flee () {
		state = IDLE;
	}

	function leave () {
		state = IDLE;
	}

	function roll () {
		return Math.ceil(Math.random() * 6);
	}

	function pushEvent (type, details) {
		const nextEvent = {
			...event,
			createdAt: new Date(),
			type,
			...details
		};
		log = [...log, nextEvent];
	}

	function getArticle (noun) {
		const firstLetter = noun.toLowerCase()[0];
		return 'aeiou'.includes(firstLetter) ? 'an' : 'a';
	}
</script>

<Layout>
	<h1>Korg</h1>
	<p class="status">{event.health} health<br>{event.gold} gold</p>
	<article aria-label="Current event" class="event" tabindex="-1">
		{#if event.type === ENCOUNTER}
			<p>You encounter {getArticle(event.encounter.label)} <strong>{event.encounter.label}</strong>.</p>
			{#if event.encounter.trap}
				<p>The trap cannot be avoided.<br>Take <strong>{event.encounter.damage} damage</strong>.</p>
				<p><button on:click={fight}>Continue</button></p>
			{:else}
				<p>You cannot flee.</p>
				<p><strong>Roll {event.encounter.defense + 1}{event.encounter.defense + 1 < 6 ? '+' : ''}</strong> to defeat the foe and gain <strong>{event.encounter.gold} gold</strong>.<br>Otherwise, take <strong>{event.encounter.damage} damage</strong>.</p>
				<p><button on:click={fight}>Fight</button></p>
			{/if}
		{/if}
		{#if event.type === FIGHT && event.win}
			<p>You <strong>rolled {event.result}</strong> and defeat the <strong>{event.encounter.label}</strong>.</p>
			<p>Gain <strong>{event.encounter.gold} gold</strong>.</p>
		{/if}
		{#if event.type === FIGHT && !event.win}
			<p>You <strong>rolled {event.result}</strong> and lose against the <strong>{event.encounter.label}</strong>.</p>
			<p>Take <strong>{event.encounter.damage} damage</strong>.</p>
		{/if}
		{#if event.type === NEW_GAME || event.type === FIGHT}
			<p><button on:click={explore}>Explore</button></p>
		{/if}
	</article>
</Layout>

<style>
	.event {
		border-top: var(--px-2) solid var(--color-base-5);
	}
</style>
