import {Schema, Types, Model, model, Document} from "mongoose";
import crypto from "crypto";

//* RESOLUTION Schema
const resolutionSchema = new Schema(
	{
		rid: {type: String, unique: true},
		rcode: {type: String},
		created: {type: Date},
		user: {type: String},
		parent: {type: Schema.Types.ObjectId},
		hash: {type: String},
		body: {
			title: {type: String},
			tag: {type: String},
			applicants: {type: Array},
			year: {type: Number},
			category: {
				name: {type: String},
				id: {type: String},
			},
			text: {type: String},
		},
	},
	{strict: "throw"} // Throw an error if invalid data is passed
);

// Create resolution hash method
resolutionSchema.methods.createHash = function () {
	// Stringify the object and take sha256 hash
	// const str = this.stringify().encode("utf-8");
	const str = this.stringify();
	return crypto.createHash("sha256").update(str).digest("hex");
};

resolutionSchema.methods.stringify = function () {
	// Stringifies the resolution object with all relevant keys for hashing
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
		category.name +
		category.id +
		body.text
	).toString();

	return stringified;
};

export interface IResolutionDocument extends Document {
	rid: String;
	rcode: String;
	created: Date;
	user: String;
	parent: Types.ObjectId;
	hash: String;
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
	createHash(): String;
	stringify(): String;
}

const ResolutionModel: Model<IResolutionDocument> = model<IResolutionDocument>(
	"Resolution",
	resolutionSchema,
	"resolutions"
);

export default ResolutionModel;
