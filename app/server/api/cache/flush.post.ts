import {createClient} from "@vercel/kv";
import {type IUser, UserRoles} from "~/types/models/user.schema";

const ALLOWED_ROLES = [UserRoles.Admin];

export default defineEventHandler(async (event) => {
	const user: IUser = event.context?.authorization?.user;

	console.log(event.context.authorization);

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

	const config = useRuntimeConfig(event);
	const kv = useStorage("data");

	const redis = createClient({
		url: config.KV_REST_API_URL,
		token: config.KV_REST_API_TOKEN,
	});

	// flush cache
	const success = await redis.flushdb();

	setResponseStatus(event, success === "OK" ? 200 : 500);

	return {
		success: success === "OK",
	};
});
