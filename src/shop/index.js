import * as rope from './rope.js';

export const shopItems = [
	rope
].map((item) => {
	const id = Symbol(item.name);
	return { id, ...item };
});
