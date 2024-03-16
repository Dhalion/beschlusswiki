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
				query.populate("resolutions");
			}
			const category = await query.exec();
			console.log(`Found category ${category?.name}`);
			return category;
		} else {
			return await CategorySchema.find();
		}
	} catch (e) {
		throw createError({
			statusCode: 500,
		});
	}
});
