import {Schema, Types, Model, model, Document} from "mongoose";
import crypto from "crypto";

// A resolution can be in one of three states
// Staged: The resolution has been created but not yet approved
// Live: The resolution has been approved and is live
// Archived: The resolution has been archived
export enum ResolutionState {
	Staged = "staged",
	Live = "live",
	Archived = "archived",
}

//* RESOLUTION Schema
const resolutionSchema = new Schema(
	{
		rid: {type: String, unique: true},
		rcode: {type: String},
		created: {type: Date},
		createdBy: {type: Schema.Types.ObjectId, ref: "User"}, // Refers to a user
		approvedBy: {type: Schema.Types.ObjectId, ref: "User"}, // Refers to a user
		parent: {type: Schema.Types.ObjectId}, // Refers to a resolution
		state: {type: String, enum: ResolutionState},
		hash: {type: String},
		body: {
			title: {type: String},
			tag: {type: String},
			applicants: {type: Array},
			year: {type: Number},
			category: {type: Schema.Types.ObjectId, ref: "Category"}, // Refers to a category
			text: {type: String},
		},
	},
	{strict: "throw"} // Throw an error if invalid data is passed
);

// Create resolution hash method
resolutionSchema.methods.createHash = function () {
	// Stringify the object and take sha256 hash
	const str = this.stringify();
	return crypto.createHash("sha256").update(str).digest("hex");
};

// Stringifies the resolution object with all relevant keys for hashing
resolutionSchema.methods.stringify = function () {
	const res = this.toObject();
	const body = res.body;
	const applicants = body.applicants;
	const category = body.category;

	const stringified = (
		res.rid +
		res.rcode +
		res.user +
		body.title +
		body.tag +
		applicants.join("") +
		body.year +
		category +
		body.text
	).toString();

	return stringified;
};

export interface IResolutionDocument extends Document {
	rid: String;
	rcode: String;
	created: Date;
	createdBy: Types.ObjectId;
	parent: Types.ObjectId;
	approvedBy: Types.ObjectId;
	state: String;
	hash: String;
	body: {
		title: String;
		tag: String;
		applicants: Array<String>;
		year: Number;
		category: Types.ObjectId;
		text: String;
	};
	createHash(): String;
	stringify(): String;
}

export const ResolutionModel: Model<IResolutionDocument> =
	model<IResolutionDocument>("Resolution", resolutionSchema, "resolutions");
