<script>
	import { idle } from '@src/actions.js';
	import { currentEvent } from '@src/log.js';
	import { getArticle } from '@src/util.js';

	$: name = $currentEvent.item?.name;
</script>

<p>You purchased {getArticle(name)} <strong>{name}</strong>.</p>
<p><button on:click={idle}>Continue</button></p>
