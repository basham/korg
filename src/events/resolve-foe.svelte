<script>
	import { idle, newGame } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
</script>

<p>You <strong>rolled {$currentEvent.attack}</strong> and take <strong>{$currentEvent.takeDamage} damage</strong> from the <strong>{$currentEvent.foe?.name}</strong>.</p>
{#if $currentEvent.health <= 0}
	<p>You die.</p>
	<p><button on:click={newGame}>New game</button></p>
{:else}
	<p><button on:click={idle}>Continue</button></p>
{/if}
