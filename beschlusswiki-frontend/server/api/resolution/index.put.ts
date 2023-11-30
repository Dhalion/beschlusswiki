import {ResolutionSchema} from "~/types/models/resolution.schema";
import {getServerSession} from "#auth";
import {type IUser, UserRoles} from "~/types/models/user.schema";

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
		const id = getQuery(event)?.id;
		const body = await readBody(event);

		if (!body?.resolution) {
			return createError({statusCode: 400, message: "No resolution provided"});
		}

		if (!id) throw createError({statusCode: 400, message: "No id provided"});
		const success = await ResolutionSchema.updateOne(
			{_id: id},
			body.resolution,
			{new: false}
		);

		if (!success)
			throw createError({
				statusCode: 500,
				message: "Error while updating resolution",
			});

		console.log(`Resolution ${id} updated`);

		return {success: true};
	} catch (e) {
		console.error(e);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});
