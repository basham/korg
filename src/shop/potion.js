import { IDLE, ITEM_SINGLE_USE } from '@src/constants.js';

export const name = 'Potion';
export const description = 'Heal d6 health.'
export const cost = 4;
export const useType = ITEM_SINGLE_USE;
export const eventTypes = [IDLE];
