import {defineMongooseModel} from "#nuxt/mongoose";
import {Types} from "mongoose";
import type {IUser} from "./user.schema";

export interface IApplicant {
	_id: Types.ObjectId;
	name: string;
	resolutions: Array<Types.ObjectId>;
	createdBy: Types.ObjectId | IUser | null;
	createdAt: Date | null;
}

export const ApplicantSchema = defineMongooseModel({
	name: "Applicant",
	schema: {
		name: {type: String, required: true, unique: true},
		resolutions: [{type: Types.ObjectId, ref: "Resolution"}],
		createdBy: {type: Types.ObjectId, ref: "User"},
		createdAt: {type: Date},
	},
	options: {
		strict: "throw",
	},
});
