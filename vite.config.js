import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		},
		modulePreload: false,
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
			},
		},
		target: 'esnext',
	},
	plugins: [
		svelte({
			emitCss: false
		})
	],
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
		},
	},
});
