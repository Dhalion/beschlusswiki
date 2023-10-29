// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	components: true,
	modules: ["@nuxt/ui", "@sidebase/nuxt-auth"],

	runtimeConfig: {
		public: {
			// omit PUBLIC due to NUXT .env syntax
			apiEndpoint: process.env.API_ENDPOINT,
			version: process.env.VERSION,
		},
	},

	routeRules: {
		"/**": {cors: true},
	},

	typescript: {
		typeCheck: true,
	},

	// Auth configuration
	auth: {
		globalAppMiddleware: false,
		baseURL: process.env.NUXT_PUBLIC_API_ENDPOINT + "/auth",

		provider: {
			type: "local",
			pages: {
				login: "/admin/login",
			},
			endpoints: {
				signIn: {path: "/login", method: "post"},
				signOut: {path: "/signout", method: "post"},
				signUp: {path: "/register", method: "post"},
				getSession: {path: "/session", method: "get"},
			},
		},
	},
	// Tailwind and CD Theming stuff
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
						beere: "#fa1464",
						helllila: "#f096e6",
						rosa: "#ffbedc",
						hellrosa: "#fae6f0",
						pink: "#f096e6",
						apricot: "#ffaa78",
						orange: "#ff8c00",
						altrot: "#c81e1e",
						lila: "#7800b4",
						bordeaux: "#500014",
						creme: "#fad2b4",
						traube: "960028",
					},
				},
			},
		},
	},
});
