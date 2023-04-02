import { DEFEAT_FOE, RESOLVE_FOE } from '@src/constants.js';
import { getCurrentEvent, pushEvent } from '@src/log.js';
import { roll } from '@src/util.js';

export function fight () {
	const event = getCurrentEvent();
	const { foe } = event;
	const attack = roll();
	if (attack > foe.attack) {
		const gainGold = foe.gold;
		pushEvent(DEFEAT_FOE, { attack, foe, gainGold });
	} else {
		const takeDamage = foe.damage;
		pushEvent(RESOLVE_FOE, { attack, foe, takeDamage });
	}
}
