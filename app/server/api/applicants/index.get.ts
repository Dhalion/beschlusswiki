import {ApplicantSchema} from "~/types/models/applicants.schema";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const id = getQuery(event)?.id;

		if (id) {
			const applicant = await ApplicantSchema.findById(id);
			return applicant || createError({statusCode: 404});
		} else {
			return (await ApplicantSchema.find()) || createError({statusCode: 404});
		}
	} catch (e) {
		throw createError({
			statusCode: 500,
		});
	}
});
