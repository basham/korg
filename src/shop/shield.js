import { ENCOUNTER_FOE, ENCOUNTER_TRAP, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'Shield';
export const description = 'Avoid damage once.'
export const cost = 3;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [ENCOUNTER_FOE, ENCOUNTER_TRAP];
