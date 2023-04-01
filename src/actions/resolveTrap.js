import { RESOLVE_TRAP, ROLL } from '@src/constants.js';
import { getCurrentEvent, pushEvent } from '@src/log.js';
import { roll } from '@src/util.js';

export function resolveTrap () {
	const event = getCurrentEvent();
	const { trap } = event;
	const { damage, gold } = trap;
	const gainGold = gold === ROLL ? roll() : 0;
	const takeDamage = damage === ROLL ? roll() : damage;
	pushEvent(RESOLVE_TRAP, { gainGold, takeDamage, trap });
}
