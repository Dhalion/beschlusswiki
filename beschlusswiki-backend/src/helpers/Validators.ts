import mongoose from "mongoose";
import {ResolutionModel} from "../db/Schemas";

export interface ResolutionDocument extends mongoose.Document {
	rid: String;
	rcode: String;
	created: number;
	user: String;
	parent: mongoose.Schema.Types.ObjectId;
	body: {
		title: String;
		tag: String;
		applicants: Array<String>;
		year: Number;
		category: {
			name: String;
			id: String;
		};
		text: String;
	};
}

export function validateResolution(resolution: ResolutionDocument): boolean {
	// Schema validation should have already been done by mongoose
	// This function only pperforms logical validation

	// Check if rcode is computed correctly from year and tag
	const computed_rcode = resolution.body.year + "-" + resolution.body.tag;
	const rcode = resolution.rcode;
	if (rcode !== computed_rcode) {
		return false;
	}

	// Check if year is valid number?
	if (typeof resolution.body.year !== "number") {
		return false;
	}

	// Check if year is valid 1970 <= year <= current year
	const year = resolution.body.year as number;
	const currentYear = new Date().getFullYear();
	if (year < 1970 || year > currentYear) {
		return false;
	}

	// Check if rid is valid as per defined format
	// rid should be 4 digit number
	const rid = resolution.rid;
	// Regex to match 4 digit hex number: ^[\da-fA-F]{4}$
	const re = new RegExp("^[\\da-fA-F]{4}$");
	if (!rid.match(re)) {
		return false;
	}

	// Check if created is valid date and is not in future
	// Created is unix timestamp
	const created = resolution.created;
	const now = Date.now();
	if (created > now) {
		return false;
	}

	// If all tests pass, return true
	return true;
}
