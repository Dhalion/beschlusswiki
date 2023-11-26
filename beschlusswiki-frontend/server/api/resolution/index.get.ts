import {CategorySchema} from "~/types/models/category.schema";
import {ResolutionSchema, SearchEngine} from "~/types/models/resolution.schema";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	try {
		const id = getQuery(event)?.id;
		const searchQuery = getQuery(event)?.query;
		const selectText = getQuery(event)?.text == ("true" || 1) ? true : false;
		const populateCategory =
			getQuery(event)?.category == ("true" || 1) ? true : false;

		const searchEngine =
			getQuery(event)?.engine == "elastic"
				? SearchEngine.ELASTICSEARCH
				: SearchEngine.MONGO;

		// console.log(
		// 	`Resolution ${id} requested with searchQuery: ${
		// 		searchQuery || "none"
		// 	} and selectText: ${selectText}`
		// );

		if (searchQuery) {
			// Search Resolution
			console.log(
				`Searching for resolution using ${searchEngine}. Query: ${searchQuery}`
			);
			if (searchEngine == SearchEngine.MONGO) {
				//******* SEARCH USING MONGODB ********
				const results = await ResolutionSchema.find({
					$text: {$search: searchQuery.toString()},
				});
				return results;
			} else {
				//******* SEARCH USING ELASTICSEARCH ********
				const url = config.elasticURI + "/resolutions/_search";
				const elasticQuery = {
					_source: {
						excludes: ["text"],
					},
					query: {
						simple_query_string: {
							query: searchQuery.toString(),
							fields: ["title^3", "tag", "text", "category^2"],
						},
					},
					size: 100,
				};

				const res = await fetch(url, {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(elasticQuery),
				})
					.then((response) => {
						if (!response.ok) {
							console.error(response);
							throw createError({
								statusCode: 500,
								message: "Error while searching with ElasticSearch",
							});
						}
						return response.json();
					})
					.then((data) => {
						console.log("Elastic returned " + data.hits.total.value + " hits");
						// Transform data to match mongoDB response
						const transformedHits = data.hits.hits.map((hit: any) => {
							return {
								_id: hit._id,
								body: hit._source,
							};
						});
						return transformedHits;
					})
					.catch((error) => {
						console.error(error);
						throw error;
					});
				return res;
			}
		}

		if (id) {
			const idIsValid = mongoose.Types.ObjectId.isValid(id.toString());

			if (!idIsValid) {
				throw createError({statusCode: 400, message: "Invalid id"});
			}

			const query = ResolutionSchema.findOne({_id: id.toString()});

			if (selectText) {
				query.select("+body.text");
			}

			if (populateCategory) {
				query.populate("body.category");
			}

			const result = await query.exec();

			if (result) {
				return result;
			} else {
				throw createError({statusCode: 404, message: "Resolution not found"});
			}
		}

		// Else return all resolutions
		return await ResolutionSchema.find({});
	} catch (error) {
		console.error(error);
		return error;
	}
});
