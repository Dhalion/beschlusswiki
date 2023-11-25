import {defineMongooseModel} from "#nuxt/mongoose";

export enum UserRoles {
	Admin = "admin",
	Editor = "editor",
	Contributor = "contributor",
}

export const UserSchema = defineMongooseModel({
	name: "User",
	schema: {
		id: {type: String, unique: true, required: true},
		username: {type: String, unique: true, required: true},
		email: {type: String, unique: true, required: false},
		roles: {type: [String], enum: Object.values(UserRoles), required: true},
		status: {type: Boolean, required: true},
		authentication: {
			passwordHash: {type: String, select: false, required: true},
			sessionToken: {type: String, select: false},
		},
	},
});
