import {
	type IResolution,
	ResolutionSchema,
} from "~/types/models/resolution.schema";
import {CategorySchema} from "~/types/models/category.schema";
import {type IUser} from "~/types/models/user.schema";

export default defineEventHandler(async (event) => {
	const user: IUser = event.context?.authorization?.user;

	if (!user || !user?.status == true) {
		const reason = !user ? "No user" : "User not active";
		return createError({
			statusCode: 401,
			message: "Unauthorized. Reason: " + reason,
		});
	}

	try {
		const body = await readBody(event);
		if (!body.resolution) {
			return createError({statusCode: 400, message: "No resolution provided"});
		}

		const bodyResolution: IResolution = body.resolution;

		// Add Author
		console.log(event.context.authorization);
		const user = event.context.authorization.user as IUser;
		if (!user) {
			throw createError({statusCode: 400, message: "No user provided"});
		}
		bodyResolution.user = user._id;

		const resolution = await ResolutionSchema.create(bodyResolution);

		if (!resolution) {
			throw createError({statusCode: 500, message: "Internal Server Error"});
		}
		console.log(`Resolution ${resolution._id} created`);

		// Append Resolution to Category
		const category = await CategorySchema.findOneAndUpdate(
			{_id: resolution.body.category},
			{$push: {resolutions: resolution._id}},
			{new: true}
		);
		if (!category) {
			throw createError({statusCode: 500, message: "Internal Server Error"});
		}
		return {statusCode: 200, success: true, id: resolution._id};
	} catch (error) {
		console.error(error);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});
