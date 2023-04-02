import { ENCOUNTER_FOE, ENCOUNTER_TRAP } from '@src/constants.js';
import { getCurrentEvent, pushEvent } from '@src/log.js';
import { roll } from '@src/util.js';

export function explore () {
	const event = getCurrentEvent();
	const { encounters } = event.location;
	const result = roll(encounters.length);
	const encounter = encounters[result - 1];
	if (encounter.attack === 0) {
		const trap = encounter;
		pushEvent(ENCOUNTER_TRAP, { trap });
	} else {
		const foe = encounter;
		pushEvent(ENCOUNTER_FOE, { foe });
	}
}
