import {
	type searchObject,
	type ResolutionSearchResult,
} from "~/types/Interfaces";
import {ResolutionSchema} from "~/types/models/resolution.schema";
import {Types} from "mongoose";
import {type IApplicant} from "~/types/models/applicant.schema";
import Id from "~/pages/resolution/[id].vue";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const kv = useStorage("data");
	try {
		// query = body.query
		const body = await readBody(event);
		console.log(body);

		// Validate the searchObject
		if (!validateSearchObject(body)) {
			setResponseStatus(event, 400);
			return createError({
				statusCode: 400,
				message: "Invalid search object.",
			});
		}

		const query = body.query as string | undefined;
		const applicants = body.applicants;
		const categories = body.categories;
		const fromYear = body.fromYear as unknown as number | undefined;
		const toYear = body.toYear as unknown as number | undefined;

		// Query the KV cache if search via query
		const isSearchCachable = searchIsCachable(body);
		if (query && isSearchCachable) {
			console.log("Querying cache");
			const result = await kv.getItem(query, {type: "json"});
			// If the item exists, return it. Add cache hit header
			if (result) {
				setResponseStatus(event, 200);
				setResponseHeader(event, "X-Cache", "HIT");
				return result as ResolutionSearchResult;
			}
		}

		// If the item doesn't exist, query elastic, then store the result in the KV cache
		const filter = generateElasticFilter(body);
		const esQuery = generateElasticQuery(query ?? "", filter);
		console.log("Query:");
		console.log(JSON.stringify(esQuery));
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
					query: generateElasticQuery(query ?? "", filter),
				}),
			}
		);
		console.log(query);

		if (res.ok) {
			try {
				const body = await res.json();
				const result = generateSearchResultObjectFromElastic(body);
				if (query && isSearchCachable) {
					kv.setItem(query, result, {type: "json"});
				}
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
			console.error(res);
			console.error("Elasticsearch failed, trying mongo");
			if (!query) {
				throw new Error("No query provided");
			}
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

function validateSearchObject(searchObject: any): boolean {
	if (
		searchObject.query &&
		(searchObject.query.length < 1 || searchObject.query.length > 1000)
	) {
		console.log("query not valid");
		return false;
	}
	if (searchObject.applicants) {
		if (!Array.isArray(searchObject.applicants)) {
			console.log("applicants not array");
			return false;
		}
		// validate applicants._id as ObjectId
		if (
			searchObject.applicants.some((id: any) => {
				return !Types.ObjectId.isValid(id);
			})
		) {
			console.log("applicants id not valid");
			return false;
		}
	}
	if (searchObject.categories) {
		if (!Array.isArray(searchObject.categories)) {
			console.log("categories not array");
			return false;
		}
		// validate categories._id as ObjectId
		if (
			searchObject.categories.some((id: any) => {
				return !Types.ObjectId.isValid(id);
			})
		) {
			console.log("categories not valid");
			return false;
		}
	}
	if (searchObject.fromYear) {
		const fromYear = searchObject.fromYear as unknown as number;
		if (fromYear < 1900 || fromYear > 2100) {
			return false;
		}
	}
	if (searchObject.toYear) {
		const toYear = searchObject.toYear as unknown as number;
		if (toYear < 1900 || toYear > 2100) {
			return false;
		}
	}
	if (searchObject.fromYear && searchObject.toYear) {
		if (searchObject.toYear < searchObject.fromYear) {
			return false;
		}
	}

	return true;
}

function searchIsCachable(searchObject: searchObject): boolean {
	if (searchObject.applicants && searchObject.applicants.length > 0) {
		return false;
	}
	if (searchObject.categories && searchObject.categories.length > 0) {
		return false;
	}
	if (searchObject.fromYear || searchObject.toYear) {
		return false;
	}
	if (!searchObject.query || searchObject.query === "") {
		return false;
	}
	return true;
}

function generateElasticQuery(query: string, filter: Object): Object {
	let queryObj = {};
	const sqs =
		query.length > 0
			? {
					simple_query_string: {
						query: query,
						default_operator: "AND",
					},
			  }
			: {};

	if (query.length > 0) {
		console.log("query length > 0");
		queryObj = {
			bool: {
				must: sqs,
				filter: filter,
			},
		};
	} else {
		console.log("query length = 0");
		queryObj = {
			bool: {
				filter: {
					bool: {
						filter,
					},
				},
			},
		};
	}
	return queryObj;
}

function generateElasticFilter(searchObject: searchObject): Object {
	let filter: any = [];

	if (searchObject.fromYear || searchObject.toYear) {
		let rangeFilter: any = {};
		if (searchObject.fromYear) {
			rangeFilter.gte = searchObject.fromYear;
		}
		if (searchObject.toYear) {
			rangeFilter.lte = searchObject.toYear;
		}
		filter.push({
			range: {
				"body.year": rangeFilter,
			},
		});
	}
	if (searchObject.applicants && searchObject.applicants.length > 0) {
		filter.push({
			terms: {
				"body.applicants": searchObject.applicants,
			},
		});
	}
	if (searchObject.categories && searchObject.categories.length > 0) {
		filter.push({
			terms: {
				"body.category": searchObject.categories,
			},
		});
	}
	return filter;
}
