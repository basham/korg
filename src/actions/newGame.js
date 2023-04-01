import { GOLD, HEALTH, NEW_GAME } from '@src/constants.js';
import { pushEvent, reset } from '@src/log.js';

export function newGame () {
	reset();
	const gold = GOLD;
	const health = HEALTH;
	pushEvent(NEW_GAME, { gold, health });
}

