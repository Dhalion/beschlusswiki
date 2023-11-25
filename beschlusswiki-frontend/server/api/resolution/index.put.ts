import {ResolutionSchema} from "~/types/models/resolution.schema";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

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
