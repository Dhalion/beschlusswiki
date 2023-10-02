import mongoose from "mongoose";

import {ResolutionModel} from "../db/Schemas";

enum SearchEngine {
	// Enum for the search engine to use
	// Built in mongoDB or ElasticSearch
	MONGO = "mongo",
	ELASTICSEARCH = "elastic",
}

interface searchOptions {
	// Search options for the searchResolutionByQuery function
	searchQuery: string;
	limit: number;
	offset: number;
	engine: SearchEngine;
}

export class ParsingError extends Error {
	// Error class for parsing errors
	constructor(message: string) {
		super(message);
		this.name = "ParsingError";
		Object.setPrototypeOf(this, ParsingError.prototype);
	}
}

export class InvalidResolutionError extends Error {
	// Error class for invalid resolutions
	constructor(message: string) {
		super(message);
		this.name = "InvalidResolutionError";
		Object.setPrototypeOf(this, InvalidResolutionError.prototype);
	}
}

export async function postResolutionToDB(resolution: any) {
	// Post given Resolution to DB
	try {
		// Validate resolution
		// Try to create new resolution Object
		const newRes = new ResolutionModel(resolution);
		if (!newRes) {
			throw new InvalidResolutionError("Invalid resolution");
		}

		// Wandele $oid in einen echten ObjectId-Wert um
		const resolutionExists = await ResolutionModel.exists({
			_id: resolution?._id?.$oid,
		});
		// If resolution already exists, overwrite it, else create a new one
		if (resolutionExists) {
			console.log(`[DB] Overwriting resolution ${resolution._id.$oid}`);
			await ResolutionModel.replaceOne({_id: resolution._id.$oid}, resolution);
		} else {
			console.log(`[DB] Creating resolution`);
			const newResolution = new ResolutionModel(resolution);
			await newResolution.save();
		}
	} catch (error: any) {
		throw error;
	}
}

function validateResolution(resolution: any) {
	// Validate a given resolution. Check if all required fields are present

	// Check if all required fields are present
	if (!resolution._id) {
		return false;
	}
	if (!resolution.titel) {
		return false;
	}
	if (!resolution.tag) {
		return false;
	}
	if (!resolution.jahr) {
		return false;
	}
	if (!resolution.fließtext) {
		return false;
	}
	return true;
}

export async function getAllResolutions() {
	// Fetch all Resolutions from DB and return them as JSON Objects in an Array
	const results = await ResolutionModel.find();
	console.log(results);
	return results;
}

export async function searchResolutionByQuery(qO: searchOptions) {
	// Search for a Resolution by a given query
	console.log(
		`[SEARCH] Searching for '${qO.searchQuery}'. Engine: ${qO.engine}`
	);
	if (qO.engine === SearchEngine.MONGO) {
		// Search in mongoDB
		return await ResolutionModel.find({$text: {$search: qO.searchQuery}})
			.limit(qO.limit)
			.skip(qO.offset)
			.exec();
	} else if (qO.engine === SearchEngine.ELASTICSEARCH) {
		// Search in ElasticSearch
		//! Not yet implemented
		throw new Error("ElasticSearch not yet implemented");
	}
	throw new Error("No valid search engine provided");
}

// Get all resolutions from DB
export async function findAll() {
	try {
		const results = await ResolutionModel.find();
		return results;
	} catch (error) {
		throw error;
	}
}

export function parseQueryOptions(query: mongoose.QueryOptions): searchOptions {
	// Parse query options from a given query
	// Returns a searchOptions object
	try {
		// Default values for optional parameters
		let limit: number = -1;
		let offset: number = 0;
		let engine: SearchEngine = SearchEngine.MONGO;

		// Parse query options and perform type checks
		if (query.limit !== undefined && query.limit !== null) {
			// Try to parse query.limit to number
			limit = parseInt(query.limit.toString());
			if (isNaN(limit)) {
				throw new ParsingError("Limit is not a number");
			}
		}

		if (query.offset !== undefined && query.offset !== null) {
			// Try to parse query.offset to number
			offset = parseInt(query.offset.toString());
			if (isNaN(offset)) {
				throw new ParsingError("Offset is not a number");
			}
		}

		if (query.engine !== undefined && query.engine !== null) {
			if (typeof query.engine !== "string") {
				throw new ParsingError("Engine is not a string");
			}
			if (query.engine !== "elastic" && query.engine !== "mongo") {
				throw new ParsingError("Engine is not a valid search engine");
			}
			if (query.engine === "elastic") {
				engine = SearchEngine.ELASTICSEARCH;
			} else if (query.engine === "mongo") {
				engine = SearchEngine.MONGO;
			}
		}

		if (!query.q) {
			throw new ParsingError("No search query provided");
		}

		if (typeof query.q !== "string") {
			throw new ParsingError("Search query is not a string");
		}

		// Return searchOptions object
		return {
			searchQuery: query.q,
			limit: limit,
			offset: offset,
			engine: engine,
		};
	} catch (error) {
		throw error;
	}
}
