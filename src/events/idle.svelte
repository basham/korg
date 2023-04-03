<script>
	import { explore, shop } from '@src/actions.js';
</script>

<p>What would you like to do?</p>
<ul>
	<li><button on:click={explore}>Explore</button></li>
	<li><button on:click={shop}>Shop</button></li>
</ul>
