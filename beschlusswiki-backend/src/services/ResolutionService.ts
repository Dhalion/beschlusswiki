import mongoose, {Types} from "mongoose";

import {validateResolution} from "../helpers/Validators";
import {
	IResolutionDocument,
	ResolutionModel,
	ResolutionState,
} from "../db/ResolutionSchema";
import QueryString from "qs";
import {env} from "../app";

enum SearchEngine {
	// Enum for the search engine to use
	// Built in mongoDB or ElasticSearch
	MONGO = "mongo",
	ELASTICSEARCH = "elastic",
}

export class InvalidResolutionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidResolutionError";
		Object.setPrototypeOf(this, InvalidResolutionError.prototype);
	}
}

export class InvalidSearchQueryError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidSearchQueryError";
		Object.setPrototypeOf(this, InvalidSearchQueryError.prototype);
	}
}

export class InvalidIdError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidIdError";
		Object.setPrototypeOf(this, InvalidIdError.prototype);
	}
}

export class ResolutionNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ResolutionNotFoundError";
		Object.setPrototypeOf(this, ResolutionNotFoundError.prototype);
	}
}

export interface searchOptions {
	// Search options for the searchResolutionByQuery function
	searchQuery: string;
	limit: number;
	offset: number;
	engine: SearchEngine;
}

export async function findAll(returnText: boolean = false) {
	// Doesn't return the text of the resolution by default.
	// This is to improve performance
	try {
		if (returnText) {
			return await ResolutionModel.find();
		} else {
			return await ResolutionModel.find().select("-text -body.text");
		}
	} catch (error) {
		throw error;
	}
}

export async function findById(id: string) {
	try {
		const result = await ResolutionModel.findById(id)
			.populate("body.category")
			.exec();
		return result;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw new InvalidIdError("Invalid id");
		} else {
			throw error;
		}
	}
}

export async function findByRID(rid: string) {
	try {
		const result = await ResolutionModel.findOne({rid: rid});
		return result;
	} catch (error) {
		throw error;
	}
}

export async function findByRCode(rcode: string) {
	try {
		const result = await ResolutionModel.find({rcode: rcode});
		return result;
	} catch (error) {
		throw error;
	}
}

export async function search(query: QueryString.ParsedQs) {
	console.log(query);
	// parse additional query parameters
	try {
		const searchQuery = query.q ? query.q.toString() : "";
		const limit = query.limit ? parseInt(query.limit.toString()) : 0;
		const offset = query.offset ? parseInt(query.offset.toString()) : 0;
		// Default search is elastic
		const engine =
			query.engine?.toString() === "mongo"
				? SearchEngine.MONGO
				: SearchEngine.ELASTICSEARCH;

		if (engine === SearchEngine.ELASTICSEARCH) {
			console.log("Using elastic");
			return await searchWithElastic(searchQuery);
		} else {
			console.log("Using mongo");
			return await ResolutionModel.find({$text: {$search: searchQuery}})
				.select("-text -body.text") // Exclude the body text from the response. Improves performance by
				.limit(limit)
				.skip(offset)
				.exec();
		}
	} catch (error) {
		throw error;
	}
}

export async function postNew(resolution: Object): Promise<Types.ObjectId> {
	try {
		const newResolution = new ResolutionModel(resolution);
		// Validate Resolution
		if (!validateResolution(newResolution.toObject())) {
			throw new InvalidResolutionError("Resolution did not pass validation");
		}

		// Check if resolution with given rid or rcode already exists
		const resolutionExists = await ResolutionModel.exists({
			$or: [{rid: newResolution.rid}, {rcode: newResolution.rcode}],
		});
		if (resolutionExists) {
			throw new InvalidResolutionError("Resolution already exists");
		}
		// Set created date
		newResolution.created = new Date();
		//TODO Set createdBy to User
		// Set state to "staged"
		newResolution.state = ResolutionState.Staged;
		// Create hash
		newResolution.hash = newResolution.createHash();
		const r = await newResolution.save();
		return r._id;
	} catch (error) {
		if (error instanceof mongoose.Error) {
			throw new InvalidResolutionError("Resolution did not pass validation");
		}
		throw error;
	}
}

export async function updateById(id: string, resolution: IResolutionDocument) {
	try {
		// Check if resolution with given id is found
		const result = await ResolutionModel.findById(id);
		if (!result) {
			throw new ResolutionNotFoundError("Resolution not found");
		}
		// Set old resolution's id to new resolution parent
		resolution.parent = result._id;
		// Set created date
		resolution.created = new Date();
		delete resolution._id;

		// Create new resolution object
		const newResolution = new ResolutionModel(resolution);
		newResolution.hash = newResolution.createHash();
		// Check if new resolution is a duplicate
		const duplicates = await ResolutionModel.find({hash: newResolution.hash});
		if (duplicates.length > 0) {
			throw new InvalidResolutionError("Resolution is a duplicate");
		}

		// Validate new Resolution
		if (!validateResolution(newResolution.toObject())) {
			throw new InvalidResolutionError("Resolution did not pass validation");
		}

		newResolution.state = ResolutionState.Staged;
		newResolution.created = new Date();
		newResolution.hash = newResolution.createHash();

		await newResolution.save();

		return result;
	} catch (error) {
		throw error;
	}
}

export async function overrideById(
	id: string,
	resolution: IResolutionDocument
) {
	try {
		// Check if resolution with given id is found
		const result = await ResolutionModel.findOneAndUpdate(
			{_id: id},
			resolution,
			{
				upsert: false,
			}
		);
		if (!result) {
			throw new ResolutionNotFoundError("Resolution not found");
		}

		return result;
	} catch (error) {
		throw error;
	}
}

export async function deleteById(id: string) {
	try {
		const result = await ResolutionModel.findByIdAndDelete(id);
		if (!result) {
			throw new InvalidResolutionError("Resolution not found");
		}
		return result;
	} catch (error) {
		throw error;
	}
}

export async function updateField(id: string, field: string, value: string) {
	const editableFields = ["state"];
	try {
		const result = await ResolutionModel.findById(id);
		if (!result) {
			throw new InvalidResolutionError("Resolution not found");
		}
		// Check if field may be edited
		if (!editableFields.includes(field)) {
			throw new InvalidResolutionError("Field is not editable");
		}
		// Update field
		// @ts-ignore
		result[field] = value;
		await result.save();
		return result;
	} catch (error) {
		throw error;
	}
}

async function searchWithElastic(query: string) {
	try {
		const URI = env.ELASTIC_URI + "/resolutions" + "/_search";

		const elasticQuery = {
			_source: {
				excludes: ["text"],
			},
			query: {
				simple_query_string: {
					query: query,
					fields: ["title^3", "tag", "text", "category^2"],
				},
			},
			size: 100,
		};

		const res = await fetch(URI, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(elasticQuery),
		})
			.then((response) => {
				if (!response.ok) {
					console.error(response);
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
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
	} catch (error) {
		throw error;
	}
}
