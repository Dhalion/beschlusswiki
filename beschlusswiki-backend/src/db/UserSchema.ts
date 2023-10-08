import {Schema, Document, model, Model} from "mongoose";

//* USER Schema
const userSchema = new Schema({
	id: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: false},
	authentication: {
		password: {type: String, select: false},
		salt: {type: String, select: false},
		sessionToken: {type: String, select: false},
	},
});

export interface IUserDocument extends Document {
	id: String;
	username: String;
	email: String;
	authentication: {
		password: String;
		salt: String;
		sessionToken: String;
	};
}

export const UserModel: Model<IUserDocument> = model<IUserDocument>(
	"User",
	userSchema,
	"users"
);
