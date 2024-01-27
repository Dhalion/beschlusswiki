import {type ElasticStatusResponse} from "~/types/Interfaces";

export default defineEventHandler(async (event) => {
	try {
		return await getElasticStatus(event.$fetch);
	} catch (error) {
		console.error(error);
		return createError({
			statusCode: 500,
			message: "Error while fetching Elastic status",
		});
	}
});

async function getElasticStatus(fetch: any) {
	const config = useRuntimeConfig();
	try {
		const res: Response = await fetch("/_cluster/health", {
			baseURL: config.public.elasticUrl,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + config.elasticManageKey,
			},
		});
		const body: ElasticStatusResponse = res as unknown as ElasticStatusResponse;
		return body;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
