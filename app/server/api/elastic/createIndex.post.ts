export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig();
		const index = getQuery(event)?.index as string;

		if (!index) {
			return createError({
				statusCode: 400,
				message: "Missing index name",
			});
		}

		const res = await event.$fetch(`/${index}`, {
			baseURL: config.public.elasticUrl,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + config.elasticManageKey,
			},
		});
		if (!res.ok) {
			return createError({
				statusCode: res.status,
				message: res.statusText,
			});
		}
		return {statusCode: 200, body: "Index created"};
	} catch (error) {
		console.error(error);
		return createError({
			statusCode: 500,
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});
