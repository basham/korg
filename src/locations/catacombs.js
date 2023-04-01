import { ROLL } from '@src/constants.js';

export const name = 'Catacombs';

export const encounters = [
	['Spike trap', 0, 4, ROLL],
	['Zombie', 2, 2, 1],
	['Ghoul', 2, 3, 2],
	['Ghost', 4, 2, 4],
	['Banshee', 3, 6, 7],
	['Lich', 5, 4, 10],
];
