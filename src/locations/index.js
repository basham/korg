import * as catacombs from './catacombs.js';
import * as ruins from './ruins.js';

export const locations = [
	catacombs,
	ruins
].map((loc) => {
	const { name } = loc;
	const id = Symbol(name);
	const encounters = loc.encounters.map(
		([label, attack, damage, gold]) => ({ label, attack, damage, gold })
	);
	return { id, encounters, name };
});
