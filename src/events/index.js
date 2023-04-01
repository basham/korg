import Idle, { id as IDLE } from './idle.svelte';
import NewGame, { id as NEW_GAME } from './new-game.svelte';
import Travel, { id as TRAVEL } from './travel.svelte';
import TravelTo, { id as TRAVEL_TO } from './travel-to.svelte';

export const events = {
	[IDLE]: Idle,
	[NEW_GAME]: NewGame,
	[TRAVEL]: Travel,
	[TRAVEL_TO]: TravelTo,
};
