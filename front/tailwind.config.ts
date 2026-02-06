/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import flyonui from "flyonui";
import flyonuiPlugin from "flyonui/plugin"; // Импортируем второй плагин

export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/flyonui/dist/js/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [
		// Add the FlyonUI plugin here
		flyonui,
		flyonuiPlugin,
	],
} satisfies Config;

// Вот здесь была лишняя скобка!
