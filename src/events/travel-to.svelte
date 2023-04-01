<script>
	import { idle } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
</script>

<p>You enter the {$currentEvent.location.name}.</p>
<p><button on:click={idle}>Continue</button></p>
