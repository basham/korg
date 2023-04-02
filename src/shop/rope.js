import { ENCOUNTER_TRAP, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'Rope';
export const description = 'Avoid trap once.'
export const cost = 2;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [ENCOUNTER_TRAP];
