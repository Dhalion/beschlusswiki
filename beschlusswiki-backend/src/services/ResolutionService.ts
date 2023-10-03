import mongoose from "mongoose";

import {ResolutionModel} from "../db/Schemas";
import {validateResolution} from "../helpers/Validators";
import {IResolutionDocument} from "../db/ResolutionSchema";

export class InvalidResolutionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DuplicateResolutionError";
		Object.setPrototypeOf(this, InvalidResolutionError.prototype);
	}
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
			throw new Error("Resolution not found");
		}
		// Set old resolution's id to new resolution parent
		// resolution.parent = result._id;
		resolution.created = new Date();
		resolution.parent = result._id;

		// Validate new Resolution
		const newResolution = new ResolutionModel(resolution);
		if (!validateResolution(newResolution.toObject())) {
			throw new InvalidResolutionError("Resolution did not pass validation");
		}

		await newResolution.save();

		return result;
	} catch (error) {
		throw error;
	}
}
