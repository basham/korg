<script context="module">
	import { GOLD, HEALTH } from '@src/constants.js';
	import { pushEvent, reset } from '@src/log.js';
	import { travel } from './travel.svelte';

	export const id = Symbol('new game');

	export function newGame () {
		reset();
		const gold = GOLD;
		const health = HEALTH;
		pushEvent(id, { gold, health });
	}
</script>

<p>You are an adventurer.</p>
<p><button on:click={travel}>Start traveling</button></p>
