import {defineMongooseModel} from "#nuxt/mongoose";
import {Types} from "mongoose";

export const CategorySchema = defineMongooseModel({
	name: "Category",
	schema: {
		name: {type: String, unique: true, required: true},
		tag: {type: String, required: true},
		// Resolutions: array of resolution ids
		resolutions: [{type: Types.ObjectId, ref: "Resolution"}],
	},
	options: {strict: "throw"},
});
