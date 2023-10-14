import mongoose, {Types} from "mongoose";

import {validateResolution} from "../helpers/Validators";
import {
	IResolutionDocument,
	ResolutionModel,
	ResolutionState,
} from "../db/ResolutionSchema";
import QueryString from "qs";

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

export interface searchOptions {
	// Search options for the searchResolutionByQuery function
	searchQuery: string;
	limit: number;
	offset: number;
	engine: SearchEngine;
}

export async function findAll() {
	try {
		const results = await ResolutionModel.find();
		return results;
	} catch (error) {
		throw error;
	}
}

export async function findById(id: string) {
	try {
		const result = await ResolutionModel.findById(id);
		return result;
	} catch (error) {
		throw error;
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

		return await ResolutionModel.find({$text: {$search: searchQuery}})
			.limit(limit)
			.skip(offset)
			.exec();
	} catch (error) {
		throw error;
	}
}

export async function postNew(resolution: Object) {
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
		await newResolution.save();
	} catch (error) {
		throw error;
	}
}

export async function updateById(id: string, resolution: IResolutionDocument) {
	try {
		// Check if resolution with given id is found
		const result = await ResolutionModel.findById(id);
		if (!result) {
			throw new InvalidResolutionError("Resolution not found");
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
