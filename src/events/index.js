import {
	ADD_ITEM,
	DEFEAT_FOE,
	ENCOUNTER_FOE,
	ENCOUNTER_TRAP,
	IDLE,
	NEW_GAME,
	RESOLVE_FOE,
	RESOLVE_TRAP,
	SHOP,
	TRAVEL,
	TRAVEL_TO
} from '@src/constants.js';
import AddItem from './add-item.svelte';
import DefeatFoe from './defeat-foe.svelte';
import EncounterFoe from './encounter-foe.svelte';
import EncounterTrap from './encounter-trap.svelte';
import Idle from './idle.svelte';
import NewGame from './new-game.svelte';
import ResolveFoe from './resolve-foe.svelte';
import ResolveTrap from './resolve-trap.svelte';
import Shop from './shop.svelte';
import Travel from './travel.svelte';
import TravelTo from './travel-to.svelte';

export const events = {
	[ADD_ITEM]: AddItem,
	[DEFEAT_FOE]: DefeatFoe,
	[ENCOUNTER_FOE]: EncounterFoe,
	[ENCOUNTER_TRAP]: EncounterTrap,
	[IDLE]: Idle,
	[NEW_GAME]: NewGame,
	[RESOLVE_FOE]: ResolveFoe,
	[RESOLVE_TRAP]: ResolveTrap,
	[SHOP]: Shop,
	[TRAVEL]: Travel,
	[TRAVEL_TO]: TravelTo,
};
