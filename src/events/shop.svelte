<script>
	import { addItem, idle } from '@src/actions.js';
	import { ITEM_MULTI_USE, ITEM_SINGLE_USE } from '@src/constants.js';
	import { currentEvent } from '@src/log.js';
	import { shopItems } from '@src/shop.js';

	$: shopInventory = getShopInventory($currentEvent);

	function getShopInventory (event) {
		const { items = [] } = event;
		const alreadyPurchased = items
			.filter(({ useType }) => useType === ITEM_MULTI_USE)
			.map(({ id }) => id);
		const availableItems = shopItems
			.filter(({ id, useType }) => useType === ITEM_SINGLE_USE || (useType === ITEM_MULTI_USE && !alreadyPurchased.includes(id)));
		const affordable = availableItems
			.filter(({ cost }) => cost <= event.gold);
		const other = availableItems
			.filter(({ cost }) => cost > event.gold);
		return { affordable, other }
	}
</script>

<p>You enter the shop.</p>
{#if shopInventory.affordable.length}
	<p>What would you like to buy?</p>
	<ul>
	{#each shopInventory.affordable as item}
		<li>
			<strong>{item.name}:</strong>
			{item.description}
			Costs {item.cost} gold.
			<button on:click={() => addItem(item.id)}>Buy<span class="u-sr-only"> {item.name}</span></button>
		</li>
	{/each}
	</ul>
{:else}
	<p>Everything is too expensive.</p>
{/if}
<p>Browse other items:</p>
<ul>
{#each shopInventory.other as item}
	<li><strong>{item.name}:</strong> {item.description} Costs {item.cost} gold.</li>
{/each}
</ul>
<p><button on:click={idle}>Exit shop</button></p>
