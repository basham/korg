<script>
	import { idle } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
</script>

<p>You <strong>rolled {$currentEvent.attack}</strong> and defeat the <strong>{$currentEvent.foe.label}</strong>.</p>
<p>Gain <strong>{$currentEvent.gainGold} gold</strong>.</p>
<p><button on:click={idle}>Continue</button></p>
