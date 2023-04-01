<script>
	import { idle, newGame } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
</script>

<p>Take <strong>{$currentEvent.takeDamage} damage</strong> from the <strong>{$currentEvent.trap?.label}</strong>.</p>
{#if $currentEvent.gainGold}
	<p>You discover <strong>{$currentEvent.gainGold} gold</strong>.</p>
{/if}
{#if $currentEvent.health <= 0}
	<p>You die.</p>
	<p><button on:click={newGame}>New game</button></p>
{:else}
	<p><button on:click={idle}>Continue</button></p>
{/if}
