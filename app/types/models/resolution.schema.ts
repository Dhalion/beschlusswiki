import {defineMongooseModel} from "#nuxt/mongoose";
import {Types} from "mongoose";
import {CategorySchema, type ICategory} from "./category.schema";
import {ResolutionState} from "../Interfaces";
import {type IResolution as IResolutionInterface} from "../Interfaces";
import {ApplicantSchema} from "./applicant.schema";

export type IResolution = IResolutionInterface;

export const ResolutionSchema = defineMongooseModel({
	name: "Resolution",
	schema: {
		rid: {type: String, unique: true},
		rcode: {type: String},
		created: {type: Date},
		createdBy: {type: Types.ObjectId, ref: "User"}, // Refers to a user
		approvedBy: {type: Types.ObjectId, ref: "User"}, // Refers to a user
		parent: {type: Types.ObjectId}, // Refers to a resolution
		state: {type: String, enum: ResolutionState},
		hash: {type: String},
		body: {
			title: {type: String},
			tag: {type: String},
			applicants: [{type: Types.ObjectId, ref: ApplicantSchema}],
			year: {type: Number},
			category: {type: Types.ObjectId, ref: CategorySchema}, // Refers to a category
			text: {type: String, select: false},
		},
	},
	options: {
		strict: "throw",
	},
});
