import {defineMongooseModel} from "#nuxt/mongoose";
import {type ObjectId} from "mongoose";
import type {Type} from "typescript";

export enum UserRoles {
	Admin = "admin",
	Editor = "editor",
	Contributor = "contributor",
}

export interface IUser {
	_id: ObjectId;
	username: String;
	email: string;
	roles: UserRoles[];
	status: boolean;
	authentication: {
		passwordHash: string;
	};
}

export const UserSchema = defineMongooseModel({
	name: "User",
	schema: {
		username: {type: String, unique: true, required: true},
		email: {type: String, unique: true, required: false},
		roles: {type: [String], enum: Object.values(UserRoles), required: true},
		status: {type: Boolean, required: true},
		authentication: {
			passwordHash: {type: String, select: false, required: true},
		},
	},
});
