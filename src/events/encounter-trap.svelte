<script>
	import { resolveTrap } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
	import { getArticle } from '@src/util.js';
</script>

<p>You encounter {getArticle($currentEvent.trap.label)} <strong>{$currentEvent.trap.label}</strong>.</p>
<p><button on:click={resolveTrap}>Continue</button></p>
