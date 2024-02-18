export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const kv = useStorage("data");
	try {
		const query = getQuery(event)?.query as string;

		if (!query) {
			return createError({
				statusCode: 400,
				message: "Query is required",
			});
		}

		// Query the KV cache
		const result = await kv.getItem(query, {type: "json"});
		console.log(result);

		// If the item exists, return it. Add cache hit header
		if (result) {
			setResponseHeader(event, "X-Cache", "HIT");
			return result;
		}

		// If the item doesn't exist, query elastic, then store the result in the KV cache

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

		kv.setItem(query, await res.json(), {type: "json"});

		setResponseHeader(event, "X-Cache", "MISS");
		return await res.json();
	} catch (error: Error | any) {
		console.error(error);
		return createError({
			statusCode: error?.statusCode || 500,
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});
