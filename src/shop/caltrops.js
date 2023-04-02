import { ENCOUNTER_FOE, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'Caltrops';
export const description = 'Flee foe once.'
export const cost = 2;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [ENCOUNTER_FOE];
