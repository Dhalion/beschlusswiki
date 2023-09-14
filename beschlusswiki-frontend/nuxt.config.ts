// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	components: true,
	modules: ["@nuxt/ui"],

	tailwindcss: {
		config: {
			theme: {
				extend: {
					colors: {
						jusorot: {
							50: "#fff0f2",
							100: "#ffdde1",
							200: "#ffc1c8",
							300: "#ff95a1",
							400: "#ff596c",
							500: "#ff263f",
							600: "#fc0622",
							700: "#e2001a",
							800: "#af0519",
							900: "#900c1b",
							950: "#500009",
						},
					},
				},
			},
		},
	},
});
