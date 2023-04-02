<script>
	import { fight } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
	import { getArticle } from '@src/util.js';

	$: foe = $currentEvent.foe;
</script>

<p>You encounter {getArticle(foe.name)} <strong>{foe.name}</strong>.</p>
<p><strong>Roll {foe.attack + 1}{foe.attack + 1 < 6 ? '+' : ''}</strong> to defeat the foe and gain <strong>{foe.gold} gold</strong>.<br>Otherwise, take <strong>{foe.damage} damage</strong>.</p>
<p><button on:click={fight}>Fight</button></p>
