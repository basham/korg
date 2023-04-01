<div class="layout">
	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		margin: 0 auto;
		max-width: 40rem;
		padding: var(--size-8);
	}

	main {
		padding-top: var(--size-8);
	}
</style>
