import { REMOVE_ITEM } from '@src/constants.js';
import { getCurrentEvent, pushEvent } from '@src/log.js';
import { shopItems } from '@src/shop.js';

export function removeItem (itemId) {
	const item = shopItems.find((i) => i.id === itemId);
	const event = getCurrentEvent();
	const index = event.items.indexOf(itemId);
	const items = index === -1 ? event.items : event.items.splice(index, 1);
	pushEvent(REMOVE_ITEM, { item, items });
}
