import {CategorySchema} from "~/types/models/category.schema";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const id = getQuery(event)?.id;
		const populateResolutions = getQuery(event)?.populateResolutions;
		const page = getQuery(event)?.page || 1;

		if (id) {
			console.log(
				`Fetching category ${id} with resolutions: ${populateResolutions}`
			);
			const query = CategorySchema.findById(id);
			if (populateResolutions) {
				// populate field resolutions in category
				// only if resolution.state is "live"
				query.populate({
					path: "resolutions",
					match: {state: "live"},
				});
			}
			const category = await query.exec();
			console.log(`Found category ${category?.name}`);
			return category;
		} else {
			const query = CategorySchema.find();
			query.populate({
				path: "resolutions",
				match: {state: "live"},
				select: "_id",
			});
			return await query.exec();
		}
	} catch (e) {
		throw createError({
			statusCode: 500,
		});
	}
});
