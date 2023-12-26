import {ResolutionSchema} from "~/types/models/resolution.schema";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		if (!body.resolution) {
			return createError({statusCode: 400, message: "No resolution provided"});
		}

		const resolution = await ResolutionSchema.create(body.resolution);

		console.log(`Resolution ${resolution._id} created`);
		return {statusCode: 200, success: true, id: resolution._id};
	} catch (error) {
		console.error(error);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});
