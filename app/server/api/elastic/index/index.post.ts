import Types from "mongoose";
import {ResolutionSchema} from "~/types/models/resolution.schema";

export default defineEventHandler(async (event) => {
	// get ids from body
	const config = useRuntimeConfig();

	try {
		const body = await readBody(event);

		if (!body?.ids) {
			return createError({statusCode: 400, message: "No ids provided"});
		}

		const ids = body.ids;

		const errors = [];

		// loop through ids
		for (let id of ids) {
			// check if id exists
			if (Types.isValidObjectId(id) === false) {
				return createError({statusCode: 400, message: "Invalid id"});
			}
			const resolution = await ResolutionSchema.findById(id);
			if (!resolution) {
				return createError({statusCode: 404, message: "Resolution not found"});
			}

			// index resolution
			const success = await indexResolution(id);
			if (!success) {
				errors.push({id: id, message: "Error while indexing resolution"});
			}
		}

		if (errors.length > 0) {
			return {statusCode: 500, success: false, errors: errors};
		}

		return {statusCode: 200, success: true};
	} catch (error) {
		console.error(error);
		throw createError({statusCode: 500, message: "Internal Server Error"});
	}
});

const checkIfResolutionIsIndexed = async (id: string): Promise<boolean> => {
	// check if resolution is index in elasticsearch
	const config = useRuntimeConfig();

	try {
		const response = await $fetch(
			`${config.public.elasticUrl}/${config.public.elasticIndex}/_doc/${id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "ApiKey " + config.elasticManageKey,
				},
			}
		);
		console.log(response);
		if (response) {
			return true;
		}
	} catch (error: any) {
		if (error.response?.status === 404) {
			return false;
		}
		console.error(error);
		return false;
	}
	return false;
};

const indexResolution = async (id: string): Promise<boolean> => {
	let update = false;
	const config = useRuntimeConfig();
	// fetch resolution and populate body
	const query = ResolutionSchema.findById(id);
	query.populate("body.text");
	const resolution = await query.exec();

	if (!resolution) {
		return false;
	}

	// check if resolution is already indexed
	const isIndexed = await checkIfResolutionIsIndexed(id);
	console.log(`Resolution ${id} is indexed: ${isIndexed}`);
	update = isIndexed;
	// remove field _id from resolution Object
	const resolutionObj = resolution.toObject() as any;
	delete resolutionObj._id;
	// console.log(JSON.stringify(resolutionObj));

	const requestUrl = update
		? `${config.public.elasticUrl}/${config.public.elasticIndex}/_doc/${id}`
		: `${config.public.elasticUrl}/${config.public.elasticIndex}/_create/${id}`;
	const requestMethod = update ? "PUT" : "POST";
	try {
		const response = await $fetch(requestUrl, {
			method: requestMethod,
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + config.elasticManageKey,
			},
			body: JSON.stringify(resolutionObj),
		});
		console.log(response);
	} catch (error: any) {
		console.error(error, error?.message);
		return false;
	}

	// index resolution
	return true;
};
