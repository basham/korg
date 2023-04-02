export function getArticle (noun = '') {
	const firstLetter = noun.toLowerCase()[0];
	return 'aeiou'.includes(firstLetter) ? 'an' : 'a';
}
