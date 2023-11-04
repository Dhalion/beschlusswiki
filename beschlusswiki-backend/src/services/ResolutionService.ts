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
		const result = await ResolutionModel.findById(id);
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
		const engine =
			query.engine?.toString() === "elastic"
				? SearchEngine.ELASTICSEARCH
				: SearchEngine.MONGO;

		if (engine === SearchEngine.ELASTICSEARCH) {
			return await searchWithElastic(searchQuery);
		} else {
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
		const tokens = tokenizeQuery(query);
		const elasticQuery = buildElasticQuery(
			query,
			tokens.tokens,
			tokens.literalTokens,
			tokens.excludeTokens
		);
		const URI = env.ELASTIC_URI + "/resolutions" + "/_search";
		const res = await fetch(URI, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(elasticQuery),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data.hits);
				return data.hits.hits;
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

const tokenizeQuery = (query: string) => {
	query = query.trim();
	// Split query into tokens
	const tokens = query.split(" ");
	// Split tokens into literal tokens and non-literal tokens. Literal tokens are surrounded by quotes
	const literalTokens: string[] = [];
	const excludeTokens: string[] = [];
	tokens.forEach((token) => {
		if (token.startsWith('"') && token.endsWith('"')) {
			literalTokens.push(token);
		} else if (token.startsWith("-")) {
			excludeTokens.push(token);
		}
	});
	// Remove quotes from literal tokens
	literalTokens.forEach((token, index) => {
		literalTokens[index] = token.replace(/"/g, "");
	});
	// Remove minus from exclude tokens
	excludeTokens.forEach((token, index) => {
		excludeTokens[index] = token.replace(/-/g, "");
	});
	return {
		tokens: tokens,
		literalTokens: literalTokens,
		excludeTokens: excludeTokens,
	};
};

const buildElasticQuery = (
	query: string,
	tokens: string[],
	literalTokens: string[],
	excludeTokens: string[]
) => {
	let elasticQuery: any = {
		_source: {
			excludes: ["text"],
		},
		query: {
			bool: {
				must: [],
				should: [],
				must_not: [],
			},
		},
	};
	// Add literal tokens to must
	literalTokens.forEach((token) => {
		elasticQuery.query.bool.must.push({
			match: {
				content: token,
			},
		});
	});
	// Add exclude tokens to must_not
	excludeTokens.forEach((token) => {
		elasticQuery.query.bool.must_not.push({
			match: {
				content: token,
			},
		});
	});
	// Add tokens to should multi_match
	elasticQuery.query.bool.should.push({
		multi_match: {
			query: query,
			fields: ["title^2", "text"],
			fuzziness: "AUTO",
			boost: 1.5,
		},
	});
	// Add tokens to should match_phrase
	elasticQuery.query.bool.should.push({
		match_phrase: {
			text: {
				query: query,
				slop: 1,
			},
		},
	});
	// Add tokens to should span_near
	elasticQuery.query.bool.should.push({
		span_near: {
			clauses: tokens.map((token) => {
				return {
					span_term: {
						text: token,
					},
				};
			}),
			slop: 1,
			in_order: true,
		},
	});

	return elasticQuery;
};
