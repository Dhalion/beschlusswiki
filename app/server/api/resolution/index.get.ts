import {ResolutionSchema} from "~/types/models/resolution.schema";
import {
	AdminDashboardResolutionsDisplay,
	ResolutionState,
	SearchEngine,
} from "~/types/Interfaces";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	try {
		const id = getQuery(event)?.id;
		const searchQuery = getQuery(event)?.query;
		const selectText = getQuery(event)?.text == ("true" || 1) ? true : false;
		const populateCategory =
			getQuery(event)?.category == ("true" || 1) ? true : false;
		const populateApplicants =
			getQuery(event)?.applicants == ("true" || 1) ? true : false;
		const filter = getQuery(event)?.filter as ResolutionState;
		const dashDisplay = getQuery(event)
			.dashDisplay as AdminDashboardResolutionsDisplay;
		const simple = getQuery(event)?.simple == ("true" || 1) ? true : false;
		const populateUser = getQuery(event)?.user == ("true" || 1) ? true : false;

		const searchEngine =
			getQuery(event)?.engine == "elastic"
				? SearchEngine.ELASTICSEARCH
				: SearchEngine.MONGO;

		// console.log(
		// 	`Resolution ${id} requested with searchQuery: ${
		// 		searchQuery || "none"
		// 	} and selectText: ${selectText}`
		// );

		if (simple) {
			// fetch all resolutions but only title tag and year
			const query = ResolutionSchema.find({}).select(
				"body.title body.tag body.year"
			);
			const result = await query.exec();
			if (result) {
				return result;
			} else {
				throw createError({statusCode: 404, message: "Resolution not found"});
			}
		}

		if (searchQuery) {
			// Search Resolution
			console.log(
				`Searching for resolution using ${searchEngine}. Query: ${searchQuery}`
			);

			if (searchEngine == SearchEngine.MONGO) {
				//******* SEARCH USING MONGODB ********
				const results = await ResolutionSchema.find({
					$text: {$search: searchQuery.toString()},
					state: "live",
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

			if (populateApplicants) {
				query.populate("body.applicants");
			}

			const result = await query.exec();

			if (result) {
				return result;
			} else {
				throw createError({statusCode: 404, message: "Resolution not found"});
			}
		}

		if (dashDisplay) {
			const query = ResolutionSchema.find({});

			if (dashDisplay == AdminDashboardResolutionsDisplay.STAGED) {
				query.where("state").equals(ResolutionState.Staged);
			} else if (dashDisplay == AdminDashboardResolutionsDisplay.NEW) {
				// Get the most recent 10 resolutions
				query.sort({created: -1}).limit(10);
			} else if (dashDisplay == AdminDashboardResolutionsDisplay.MY) {
				// Not yet implemented
				return createError({
					statusCode: 501,
					message: "Not yet implemented",
				});
			}

			const result = await query.exec();

			if (result) {
				return result;
			} else {
				throw createError({statusCode: 404, message: "Resolution not found"});
			}
		}

		// Else return all resolutions
		const query = ResolutionSchema.find({});
		if (selectText) {
			query.select("+body.text");
		}
		if (populateCategory) {
			query.populate("body.category");
		}
		if (filter === ResolutionState.Staged) {
			query.where("state").equals(ResolutionState.Staged);
		}
		if (populateApplicants) {
			query.populate("body.applicants");
		}
		if (populateUser) {
			query.populate("createdBy");
		}
		const result = query.exec();
		if (result) {
			return result;
		}
	} catch (error) {
		console.error(error);
		return error;
	}
});
