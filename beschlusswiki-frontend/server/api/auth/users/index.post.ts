import {type IUser, UserRoles, UserSchema} from "~/types/models/user.schema";
import crypto from "crypto";
import bcrypt from "bcrypt";

const ALLOWED_ROLES = [UserRoles.Admin];

export default defineEventHandler(async (event) => {
	const user: IUser = event.context?.authorization?.user;

	if (!user || !user?.status == true) {
		const reason = !user ? "No user" : "User not active";
		return createError({
			statusCode: 401,
			message: "Unauthorized. Reason: " + reason,
		});
	}

	// Check if user has required role
	if (!user?.roles?.some((role) => ALLOWED_ROLES.includes(role))) {
		return createError({
			statusCode: 403,
			message:
				"Forbidden. Missing required privileges of role " +
				ALLOWED_ROLES.join(" or "),
		});
	}

	try {
		const body = await readBody(event);
		const username = body?.username;
		const password = body?.password;
		const roles = body?.roles;
		const enabled = body?.enabled;

		if (!username || !password || !roles || !enabled) {
			return new Response("Invalid User", {status: 400});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new UserSchema({
			username: username,
			authentication: {
				passwordHash: hashedPassword,
			},
			roles: roles,
			status: enabled,
		});

		const success = await user.save();

		if (success) {
			console.log(`User ${username} created`);
			return {success: true};
		} else {
			return createError({statusCode: 500, message: "Internal Server Error"});
		}
	} catch (error) {
		console.error(error);
		return createError({statusCode: 500, message: "Internal Server Error"});
	}
});
