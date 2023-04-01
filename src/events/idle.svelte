<script context="module">
	import { pushEvent } from '@src/log.js';

	export const id = Symbol('idle');

	export function idle () {
		pushEvent(id);
	}
</script>

<p>What would you like to do?</p>
<p><button>Explore</button></p>
<p><button>Shop</button></p>
