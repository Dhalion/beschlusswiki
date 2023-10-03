import {Schema, Types, Model, model, Document} from "mongoose";

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
}

export default model<IResolutionDocument>(
	"Resolution",
	resolutionSchema,
	"resolutions"
);
