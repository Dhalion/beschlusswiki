import {type ElasticApiKeyResponse} from "~/types/Interfaces";

const RESOLUTIONS_INDEX = "resolutions";

export default defineEventHandler(async (event) => {
	// This Endpoint generates a new ElasticSearch API Key for using the
	// Search API. Is has no Permissions otherwise. These Keys are given
	// to untrusted Clients (i.e. the Frontend) to access the Search API.

	// generate random 16 character string
	const seed =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
	try {
		const key = await generateSearchApiKey(seed, event.$fetch);
		return key;
	} catch (e) {
		console.error(e);
		return createError({
			statusCode: 500,
			message: "Error while generating key",
		});
	}
});

async function generateSearchApiKey(
	seed: string,
	fetch: Function
): Promise<ElasticApiKeyResponse> {
	const config = useRuntimeConfig();
	try {
		const res: Response = await fetch("/_security/api_key/grant", {
			baseURL: config.public.elasticUrl,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + config.elasticManageKey,
			},
			body: {
				grant_type: "password",
				username: "search_user",
				password: "nU5&Xq&7@N^6kSff2HW7$Bes",
				api_key: {
					name: `client-key-${seed}`,
				},
			},
		});
		const body = res as unknown as ElasticApiKeyResponse;
		if (!body?.api_key) {
			throw new Error("No API Key returned");
		}

		return body;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
