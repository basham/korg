import { ENCOUNTER_FOE, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'Death scroll';
export const description = 'Defeat one foe.'
export const cost = 8;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [ENCOUNTER_FOE];
