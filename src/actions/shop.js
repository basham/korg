import { SHOP } from '@src/constants.js';
import { pushEvent } from '@src/log.js';

export function shop () {
	pushEvent(SHOP);
}
