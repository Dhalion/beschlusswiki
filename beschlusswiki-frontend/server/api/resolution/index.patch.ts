import {PatchActions, ResolutionState} from "~/types/Interfaces";
import {ResolutionSchema} from "~/types/models/resolution.schema";
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
		const action = getQuery(event)?.action;

		if (!id || !action)
			return createError({
				statusCode: 400,
				message: "No id or action provided",
			});

		switch (action) {
			case PatchActions.ACCEPT: {
				const success = await ResolutionSchema.updateOne(
					{_id: id},
					{state: ResolutionState.Live},
					{new: false}
				);
				if (!success)
					throw createError({
						statusCode: 500,
						message: "Error while updating resolution",
					});
				console.log(`Resolution ${id} accepted`);
				break;
			}
			case PatchActions.ARCHIVE: {
				const success = await ResolutionSchema.updateOne(
					{_id: id},
					{state: ResolutionState.Archived},
					{new: false}
				);
				if (!success)
					throw createError({
						statusCode: 500,
						message: "Error while updating resolution",
					});
				console.log(`Resolution ${id} archived`);
				break;
			}
			case PatchActions.REJECT: {
				const success = await ResolutionSchema.updateOne(
					{_id: id},
					{state: ResolutionState.Rejected},
					{new: false}
				);
				if (!success)
					throw createError({
						statusCode: 500,
						message: "Error while updating resolution",
					});
				console.log(`Resolution ${id} rejected`);
				break;
			}
			case PatchActions.SET_STATE_LIVE: {
				const success = await ResolutionSchema.updateOne(
					{_id: id},
					{state: ResolutionState.Live},
					{new: false}
				);
				if (!success)
					throw createError({
						statusCode: 500,
						message: "Error while updating resolution",
					});
				console.log(`Resolution ${id} set to live`);
				break;
			}
			case PatchActions.SET_STATE_STAGED: {
				const success = await ResolutionSchema.updateOne(
					{_id: id},
					{state: ResolutionState.Staged},
					{new: false}
				);
				if (!success)
					throw createError({
						statusCode: 500,
						message: "Error while updating resolution",
					});
				console.log(`Resolution ${id} set to staged`);
				break;
			}

			default:
				return createError({
					statusCode: 400,
					message: `Unknown action ${action}`,
				});
		}
	} catch (error) {
		console.error(error);
		return error;
	}
});
