import { BUY_ITEM } from '@src/constants.js';
import { getCurrentEvent, pushEvent } from '@src/log.js';
import { shopItems } from '@src/shop.js';

export function buyItem (itemId) {
	const event = getCurrentEvent();
	const item = shopItems.find((i) => i.id === itemId);
	const items = [...event.items, itemId];
	const { cost } = item;
	const gainGold = cost * -1;
	pushEvent(BUY_ITEM, { gainGold, item, items });
}
