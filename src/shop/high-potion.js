import { ENCOUNTER_FOE, ENCOUNTER_TRAP, IDLE, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'High potion';
export const description = 'Heal 2d6 health.'
export const cost = 7;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [ENCOUNTER_FOE, ENCOUNTER_TRAP, IDLE];
