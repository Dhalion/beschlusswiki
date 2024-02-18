// https://nuxt.com/docs/api/configuration/nuxt-config
const version = require("./package.json").version;

export default defineNuxtConfig({
	devtools: {
		enabled: false,

		timeline: {
			enabled: true,
		},
	},

	components: true,
	modules: ["@nuxt/ui", "@sidebase/nuxt-auth", "nuxt-mongoose"],

	runtimeConfig: {
		// Secret for server-side
		serverSecret: process.env.NUXT_SEVER_SECRET,
		elasticManageKey: process.env.NUXT_ELASTIC_MANAGE_API_KEY,
		public: {
			// Public for client-side
			// omit PUBLIC due to NUXT .env syntax
			elasticUrl: process.env.NUXT_PUBLIC_ELASTIC_URL,
			elasticIndex: process.env.NUXT_PUBLIC_ELASTIC_INDEX,
			apiEndpoint: process.env.NUXT_PUBLIC_API_ENDPOINT,
			version: version,
		},
	},

	routeRules: {
		"/**": {cors: true},
		"/edit": {
			ssr: false,
		},
	},

	typescript: {
		typeCheck: true,
	},

	//* Mongoose Server Route
	mongoose: {
		uri: process.env.MONGO_URI,
		options: {
			dbName: process.env.MONGO_DB_NAME,
		},
		modelsDir: "~/types/models",
	},

	//* Vercel KV Store
	nitro: {
		storage: {
			data: {driver: "vercelKV"},
		},
	},

	//* Auth configuration
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
			token: {
				signInResponseTokenPointer: "/token",
			},
			sessionDataType: {
				token: "string",
				user: {
					_id: "string",
					username: "string",
					email: "string",
					roles: "array",
					status: "boolean",
				},
				expires: "Date",
			},
		},
	},
	//* Tailwind and CD Theming stuff
	colorMode: {
		preference: "light",
	},
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
						traube: "#960028",
					},
				},
			},
		},
	},
});
