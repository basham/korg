<script>
	import Layout from './layout.svelte';

	const IDLE = Symbol('idle');
	const EXPLORE = Symbol('explore');
	const SHOP = Symbol('shop');

	let state = IDLE;
	let hp = 20;
	let gp = 0;
	let log = [];

	function shop () {
		state = SHOP;
	}

	const location = {
		label: 'Ruin',
		encounters: [
			['Spike trap', null, 3, 0],
			['Skeleton', 2, 2, 1],
			['Goblin', 3, 2, 2],
			['Wraith', 5, 2, 4],
			['Ogre', 4, 4, 7],
			['Demon', 4, 6, 10]
		].map(([label, defense, damage, gold]) =>
			({ label, defense, damage, gold })
		)
	}

	function explore () {
		state = EXPLORE;
		const result = roll();
		const encounter = location.encounters[result - 1];
		const event = {
			createdAt: new Date(),
			encounter,
			gp,
			hp,
			result,
			type: 'encounter',
			location
		};
		log = [...log, event];
	}

	function fight () {
		state = IDLE;
		const lastEvent = log.at(-1);
		const result = roll();
		const { encounter } = lastEvent;
		const win = encounter.defense !== null && result > encounter.defense;
		const event = {
			createdAt: new Date(),
			encounter,
			gp: gp + (win ? encounter.gold : 0),
			hp: hp - (win ? 0 : encounter.damage),
			result,
			type: 'fight',
			location,
			win
		};
		hp = event.hp;
		gp = event.gp;
		log = [...log, event];
	}

	function flee () {
		state = IDLE;
	}

	function leave () {
		state = IDLE;
	}

	function roll () {
		return Math.ceil(Math.random() * 6);
	}
</script>

<Layout>
	<h1>Korg</h1>
	<div>{hp} HP</div>
	<div>{gp} GP</div>
	<div>
		{#if state === IDLE}
			<h2>Play</h2>
			<button on:click={explore}>Explore</button>
			<button on:click={shop}>Shop</button>
		{/if}
		{#if state === EXPLORE}
			<h2>Explore</h2>
			<button on:click={fight}>Fight</button>
			<button on:click={flee}>Flee</button>
		{/if}
		{#if state === SHOP}
			<h2>Shop</h2>
			<button on:click={leave}>Leave shop</button>
		{/if}
	</div>
	<h2>Log</h2>
	<ol>
		{#each log as event}
			<li>
				<div>{event.type}</div>
				<div>{event.location.label}</div>
				<div>{event.encounter.label}</div>
				<div>{event.hp} HP</div>
				<div>{event.gp} GP</div>
			</li>
		{/each}
	</ol>
</Layout>
