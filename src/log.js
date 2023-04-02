import { derived, get, writable } from 'svelte/store';
import { locations } from '@src/locations.js';

const log = writable([]);

export const currentEvent = derived(log, ($log) => $log.at(-1) || {});

export const getCurrentEvent = () => get(currentEvent);

export function pushEvent(type, details = {}) {
	const event = getCurrentEvent();
	const {
		gainGold = 0,
		gold = event.gold,
		heal = 0,
		health = event.health,
		items = event.items || [],
		location = event.location?.id,
		takeDamage = 0,
	} = details;
	const nextEvent = {
		type,
		...details,
		createdAt: new Date(),
		gold: gold + gainGold,
		health: health - takeDamage + heal,
		items,
		get location () {
			return locations.find(({ id }) => id === location);
		}
	};
	log.update((l) => [...l, nextEvent]);
}

export function reset() {
	log.set([]);
}
