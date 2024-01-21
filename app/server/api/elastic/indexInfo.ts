const DEFAULT_INDEX = "resolutions";

export default defineEventHandler(async (event) => {
	try {
		const index = (getQuery(event)?.index as string) || DEFAULT_INDEX;

		if (!(await indexExists(event.fetch, index))) {
			return createError({
				statusCode: 404,
				message: "Index does not exist",
			});
		}

		const count = await getCount(event.fetch, index);

		if (count === 0) {
			// setResponseStatus(event, 204);
			return {
				statusCode: 204,
				message: "Index is empty",
			};
		}

		const res: Response = await getIndexInfo(event.$fetch, index);
		if (!res) {
			return createError({
				statusCode: 500,
				message: "Error while fetching index info",
			});
		}

		return {
			statusCode: 200,
			data: res,
		};
	} catch (error: Error | any) {
		console.error(`Error while fetching index info: ${error}`);
		return createError({
			statusCode: error?.statusCode || 500,
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

async function getIndexInfo(fetch: any, index: string): Promise<Response> {
	const config = useRuntimeConfig();

	const res: Response = await fetch(`/${index}/_count`, {
		baseURL: config.public.elasticUrl,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "ApiKey " + config.elasticManageKey,
		},
	});
	return res;
}

async function indexExists(fetch: any, index: string): Promise<boolean> {
	const config = useRuntimeConfig();
	const res: Response = await fetch(`${config.public.elasticUrl}/${index}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "ApiKey " + config.elasticManageKey,
		},
	});
	return res.ok;
}

async function getCount(fetch: any, index: string): Promise<number> {
	const config = useRuntimeConfig();

	const res: Response = await fetch(
		`${config.public.elasticUrl}/${index}/_count`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + config.elasticManageKey,
			},
		}
	);
	const json = await res.json();
	return json.count || 0;
}
