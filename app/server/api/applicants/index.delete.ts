import {ApplicantSchema} from "~/types/models/applicant.schema";
import {type IUser, UserRoles} from "~/types/models/user.schema";

const ALLOWED_ROLES = [UserRoles.Admin, UserRoles.Editor];

export default defineEventHandler(async (event) => {
	const user: IUser = event.context?.authorization?.user ?? null;

	if (!user || !user?.status) {
		const reason = !user ? "No user" : "User not active";
		return createError({
			statusCode: 401,
			message: "Unauthorized. Reason: " + reason,
		});
	}

	try {
		// Check if user has required role
		if (!user?.roles?.some((role) => ALLOWED_ROLES.includes(role))) {
			return createError({
				statusCode: 403,
				message:
					"Forbidden. Missing required privileges of role " +
					ALLOWED_ROLES.join(" or "),
			});
		}

		const id = getQuery(event)?.id;

		if (!id) throw createError({statusCode: 400, message: "No id provided"});

		const success = await ApplicantSchema.deleteOne({_id: id});

		if (!success)
			throw createError({
				statusCode: 500,
				message: "Error while deleting applicant",
			});

		console.log(`Applicant ${id} deleted`);

		setResponseStatus(event, 200);
		return;
	} catch (e) {
		console.error(e);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});
