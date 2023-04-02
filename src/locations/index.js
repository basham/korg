import * as catacombs from './catacombs.js';
import * as darkTower from './dark-tower.js';
import * as fetidSwamp from './fetid-swamp.js';
import * as ruins from './ruins.js';

export const locations = [
	catacombs,
	darkTower,
	fetidSwamp,
	ruins
].map((loc) => {
	const { name } = loc;
	const id = Symbol(name);
	const encounters = loc.encounters.map(
		([name, attack, damage, gold]) => ({ name, attack, damage, gold })
	);
	return { id, encounters, name };
});
