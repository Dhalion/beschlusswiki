import {type ResolutionSearchResult} from "~/types/Interfaces";
import {ResolutionSchema} from "~/types/models/resolution.schema";

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

		// If the item exists, return it. Add cache hit header
		if (result) {
			setResponseStatus(event, 200);
			setResponseHeader(event, "X-Cache", "HIT");
			return result as ResolutionSearchResult;
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
					_source: {
						excludes: ["body.text"], // Hier schließen wir das 'text'-Feld aus
					},
					query: {
						simple_query_string: {
							query: query,
							default_operator: "AND",
						},
					},
				}),
			}
		);

		if (res.ok) {
			try {
				const body = await res.json();
				const result = generateSearchResultObjectFromElastic(body);
				kv.setItem(query, result, {type: "json"});
				setResponseStatus(event, 200);
				setResponseHeader(event, "X-Cache", "MISS");
				setResponseHeader(event, "X-SE", "ELASTIC");
				console.log("Result from elastic", result);
				return result;
			} catch (error) {
				console.error(error);
				setResponseStatus(event, 500);
				return;
			}
		} else {
			// query mongo instead
			console.error("Elasticsearch failed, trying mongo");
			const results = await ResolutionSchema.find({
				$text: {$search: query.toString()},
				state: "live",
			}).select("body.title body.tag body.year");

			if (!results) {
				setResponseStatus(event, 404);
				return createError({
					statusCode: 404,
					message: "No results found",
				});
			}
			const result = generateSearchResultObjectFromMongo(results);
			// Dont cache mongo results
			setResponseStatus(event, 200);
			setResponseHeader(event, "X-Cache", "MISS");
			setResponseHeader(event, "X-SE", "MONGO");
			return result;
		}
	} catch (error: Error | any) {
		console.error(error);
		setResponseStatus(event, 500);
		return;
	}
});

function generateSearchResultObjectFromElastic(
	fetchResult: any
): ResolutionSearchResult {
	try {
		const result: ResolutionSearchResult = {
			results: [],
			total: 0,
			took: 0,
		} as ResolutionSearchResult;
		result.results = fetchResult.hits.hits.map((hit: any) => {
			const source = hit._source;
			return {
				_id: hit._id,
				title: source?.body?.title,
				tag: source?.body?.tag,
				year: source?.body?.year,
			};
		});
		result.total = fetchResult.hits.total.value;
		result.took = fetchResult.took;
		return result;
	} catch (error) {
		console.error("Failed parsing search result" + error);
		return {
			total: 0,
			took: 0,
			results: [],
		};
	}
}

function generateSearchResultObjectFromMongo(
	fetchResult: any
): ResolutionSearchResult {
	try {
		const result: ResolutionSearchResult = {
			results: [],
			total: 0,
			took: 0,
		} as ResolutionSearchResult;
		result.results = fetchResult.map((hit: any) => {
			return {
				_id: hit._id,
				title: hit.body.title,
				tag: hit.body.tag,
				year: hit.body.year,
			};
		});
		result.total = fetchResult.length;
		return result;
	} catch (error) {
		console.error("Failed parsing search result" + error);
		return {
			total: 0,
			took: 0,
			results: [],
		};
	}
}
