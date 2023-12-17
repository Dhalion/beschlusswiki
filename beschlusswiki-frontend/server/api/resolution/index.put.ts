import {CategorySchema} from "~/types/models/category.schema";
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
		const body = await readBody(event);

		if (!body?.resolution) {
			return createError({statusCode: 400, message: "No resolution provided"});
		}

		if (!id) throw createError({statusCode: 400, message: "No id provided"});

		const before = await ResolutionSchema.findById(id);

		if (!before)
			throw createError({statusCode: 404, message: "Resolution not found"});

		const success = await ResolutionSchema.findByIdAndUpdate(
			{_id: id},
			body.resolution,
			{new: true}
		);

		if (!success)
			throw createError({
				statusCode: 500,
				message: "Error while updating resolution",
			});
		const beforeCategoryId = before.body.category
			? String(before.body.category)
			: null;
		const afterCategoryId = success.body.category
			? String(success.body.category)
			: null;

		const categoryChanged = beforeCategoryId !== afterCategoryId;

		if (categoryChanged && afterCategoryId) {
			console.log("Category changed");
			if (beforeCategoryId) {
				const removeOld = await CategorySchema.findByIdAndUpdate(
					{_id: before.body.category},
					{$pull: {resolutions: before._id}}
				);
				if (!removeOld) console.error("Error while removing old category");
				console.log(
					`Removed resolution ${before._id} from category ${before.body.category}`
				);
			}
			const addNew = await CategorySchema.findByIdAndUpdate(
				{_id: success.body.category},
				{$push: {resolutions: success._id}}
			);
			if (!addNew) console.error("Error while adding new category");
			console.log(
				`Added resolution ${success._id} to category ${success.body.category}`
			);
		}

		console.log(`Resolution ${id} updated`);

		return {success: true};
	} catch (e) {
		console.error(e);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});
