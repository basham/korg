import { ROLL } from '@src/constants.js';

export const name = 'Fetid Swamp';

export const encounters = [
	['Acid trap', 0, 0, -4],
	['Croaker', 1, 3, 0],
	['Snakefolk', 3, 3, 4],
	['Slime', 4, 0, ROLL],
	['Shaman', 4, 3, 6],
	['Basilisk', 3, 8, 12]
];
