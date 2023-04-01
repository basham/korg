import {
	ENCOUNTER_TRAP,
	IDLE,
	NEW_GAME,
	RESOLVE_TRAP,
	TRAVEL,
	TRAVEL_TO
} from '@src/constants.js';
import EncounterTrap from './encounter-trap.svelte';
import Idle from './idle.svelte';
import NewGame from './new-game.svelte';
import ResolveTrap from './resolve-trap.svelte';
import Travel from './travel.svelte';
import TravelTo from './travel-to.svelte';

export const events = {
	[ENCOUNTER_TRAP]: EncounterTrap,
	[IDLE]: Idle,
	[NEW_GAME]: NewGame,
	[RESOLVE_TRAP]: ResolveTrap,
	[TRAVEL]: Travel,
	[TRAVEL_TO]: TravelTo,
};
