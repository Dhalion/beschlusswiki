// https://nuxt.com/docs/api/configuration/nuxt-config
const version = require("./package.json").version;
import colors from "./tailwind.colors";

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
		"/": {
			swr: true,
		},
		"/category": {
			isr: true,
		},
		"/edit": {
			ssr: false,
		},
		"/admin/**": {
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
		configPath: "tailwind.config.js",
		config: {
			theme: {
				extend: {
					colors: colors,
				},
			},
		},
	},
});
