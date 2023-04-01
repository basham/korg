import { TRAVEL_TO } from '@src/constants.js';
import { pushEvent } from '@src/log.js';

export function travelTo (location) {
	pushEvent(TRAVEL_TO, { location });
}
