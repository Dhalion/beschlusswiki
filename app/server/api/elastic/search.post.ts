export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event)?.query as string;

		if (!query) {
			return createError({
				statusCode: 400,
				message: "Query is required",
			});
		}

		const config = useRuntimeConfig();

		const res = await fetch(
			`${config.public.elasticUrl}/${config.public.elasticIndex}/_search`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "ApiKey " + config.elasticManageKey,
				},
				body: JSON.stringify({
					query: {
						simple_query_string: {
							query: query,
							default_operator: "AND",
						},
					},
				}),
			}
		);

		if (!res) {
			return createError({
				statusCode: 500,
				message: "Error while searching",
			});
		}

		return res.json();
	} catch (error: Error | any) {
		console.error(error);
		return createError({
			statusCode: error?.statusCode || 500,
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});
