/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import flyonui from "flyonui";
import flyonuiPlugin from "flyonui/plugin"; // Импортируем второй плагин
import tailwindScrollbar from "tailwind-scrollbar"
export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/flyonui/dist/js/*.js",
	],
	theme: {
		extend: {
			screens: {
				xs: "340px", // Добавляет новый размер
			},
		},
	},
	plugins: [
		// Add the FlyonUI plugin here
		tailwindScrollbar,
		flyonui,
		flyonuiPlugin,
	],
} satisfies Config;

