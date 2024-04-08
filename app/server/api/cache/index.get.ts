import {createClient} from "@vercel/kv";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const kv = useStorage("data");

	const redis = createClient({
		url: config.KV_REST_API_URL,
		token: config.KV_REST_API_TOKEN,
	});

	// get number of keys in cache
	const cacheSize = await redis.dbsize();
	// get all keys in cache
	const keys = await redis.keys("*");

	setResponseStatus(event, 200);
	return {
		size: cacheSize,
		keys: keys,
	};
});
