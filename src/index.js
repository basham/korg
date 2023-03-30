const params = new URLSearchParams(window.location.search);
const route = params.get('p') || 'index';

const pages = import.meta.glob(`./pages/**/*.svelte`);
const key = (part) => `./pages/${part}.svelte`;
const module = pages[key(route)] || pages[key(`${route}/index`)];

if (module) {
	const Page = (await module()).default;
	const target = document.body;
	new Page({ target });
}
