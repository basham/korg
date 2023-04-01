import { IDLE } from '@src/constants.js';
import { pushEvent } from '@src/log.js';

export function idle () {
	pushEvent(IDLE);
}
