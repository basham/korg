import { TRAVEL } from '@src/constants.js';
import { pushEvent } from '@src/log.js';

export function travel () {
	pushEvent(TRAVEL);
}
