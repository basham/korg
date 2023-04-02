import * as armor from './armor.js';
import * as caltrops from './caltrops.js';
import * as deathScroll from './death-scroll.js';
import * as highPotion from './high-potion.js';
import * as litheBoots from './lithe-boots.js';
import * as potion from './potion.js';
import * as rope from './rope.js';
import * as shield from './shield.js';
import * as sword from './sword.js';

export const shopItems = [
	rope,
	caltrops,
	shield,
	potion,
	litheBoots,
	sword,
	highPotion,
	deathScroll,
	armor
].map((item) => {
	const id = Symbol(item.name);
	return { id, ...item };
});
