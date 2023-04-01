import { derived, get, writable } from 'svelte/store';
import { locations } from '@src/locations.js';

const log = writable([]);

export const currentEvent = derived(log, ($log) => $log.at(-1) || {});

export const getCurrentEvent = () => get(currentEvent);

export function pushEvent(type, details = {}) {
	const event = getCurrentEvent();
	const {
		changeItems = (i) => i,
		gainGold = 0,
		gold = event.gold,
		heal = 0,
		health = event.health,
		items = event.items || [],
		location = event.location?.id,
		takeDamage = 0,
	} = details;
	const nextEvent = {
		...details,
		createdAt: new Date(),
		get location() {
			return locations.find(({ id }) => id === location);
		},
		gold: gold + gainGold,
		health: health - takeDamage + heal,
		items: changeItems(items),
		type
	};
	log.update((l) => [...l, nextEvent]);
}

export function reset() {
	log.set([]);
}
