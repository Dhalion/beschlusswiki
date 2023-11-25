import {UserSchema} from "~/types/models/user.schema";

export default defineEventHandler(async (event) => {
	// Require admin role
	if (!event.context.authorization?.roles.includes("admin")) {
		// Return 401
		return new Response("Unauthorized", {status: 401});
	}
	try {
		return await UserSchema.find({});
	} catch (error) {
		return error;
	}
});
