import {CategorySchema} from "~/types/models/category.schema";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const id = getQuery(event)?.id;

		if (id) {
			const category = await CategorySchema.findById(id);
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
