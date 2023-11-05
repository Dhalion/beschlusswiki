import {Model, Schema, model} from "mongoose";

const categorySchema = new Schema(
	{
		name: {type: String, unique: true, required: true},
		tag: {type: String, required: true},
	},
	{strict: "throw"}
);

export interface ICategoryDocument extends Document {
	name: string;
	tag: string;
}

export const CategoryModel: Model<ICategoryDocument> = model<ICategoryDocument>(
	"Category",
	categorySchema,
	"categories"
);
