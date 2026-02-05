/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		// Add this line to include FlyonUI files
		"./node_modules/flyonui/dist/js/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [
		// Add the FlyonUI plugin here
		require("flyonui"),
		require("flyonui/plugin"),
	],
};
