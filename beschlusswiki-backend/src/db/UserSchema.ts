import {Schema, Document, model, Model} from "mongoose";

export enum UserRoles {
	Admin = "admin",
	Editor = "editor",
	Contributor = "contributor",
}

//* USER Schema
const userSchema = new Schema({
	id: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: false},
	roles: {type: [String], enum: Object.values(UserRoles), required: true},
	status: {type: Boolean, required: true},
	authentication: {
		passwordHash: {type: String, select: false, required: true},
		sessionToken: {type: String, select: false},
	},
});

export interface IUserDocument extends Document {
	id: string;
	username: string;
	email: String;
	roles: Array<string>;
	status: boolean;
	authentication: {
		passwordHash: string;
		sessionToken: string;
	};
}

export const UserModel: Model<IUserDocument> = model<IUserDocument>(
	"User",
	userSchema,
	"users"
);
