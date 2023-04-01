import { ROLL } from '@src/constants.js';

export const name = 'Dark Tower';

export const encounters = [
	['Crow', 2, 1, 0],
	['Guard', 3, 2, 1],
	['Gargoyle', 4, 2, 3],
	['Werewolf', 3, 4, 5],
	['Pendulumn trap', 0, ROLL, 0],
	['Vampire', 5, 5, 11]
];
