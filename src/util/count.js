export function count (source = []) {
	return source.reduce((map, item) => {
		if (!map.has(item)) {
			map.set(item, 0);
		}
		map.set(item, map.get(item) + 1);
		return map;
	}, new Map());
}
