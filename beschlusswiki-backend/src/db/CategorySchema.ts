import {Model, Schema, model} from "mongoose";

const categorySchema = new Schema(
	{
		name: {type: String, unique: true, required: true},
		tag: {type: String, required: true},
		// Resolutions: array of resolution ids
		resolutions: [{type: Schema.Types.ObjectId, ref: "Resolution"}],
	},
	{strict: "throw"}
);

export interface ICategoryDocument extends Document {
	name: string;
	tag: string;
	resolutions: Schema.Types.ObjectId[];
}

export const CategoryModel: Model<ICategoryDocument> = model<ICategoryDocument>(
	"Category",
	categorySchema,
	"categories"
);
