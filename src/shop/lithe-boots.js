import { ENCOUNTER_FOE, ITEM_MULTI_USE } from '@src/constants.js';

export const name = 'Lithe boots';
export const description = 'Roll 3+ to flee foe.'
export const cost = 4;
export const useType = ITEM_MULTI_USE;
export const eventTypes = [ENCOUNTER_FOE];
