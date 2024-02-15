import {type INewApplicant} from "~/types/Interfaces";
import {
	ApplicantSchema,
	type IApplicant,
} from "~/types/models/applicants.schema";
import {ResolutionSchema} from "~/types/models/resolution.schema";
import {type IUser} from "~/types/models/user.schema";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const user = event.context?.authorization?.user as IUser | undefined;

		if (!user || !user?.status == true) {
			const reason = !user ? "No user" : "User not active";
			return createError({
				statusCode: 401,
				message: "Unauthorized. Reason: " + reason,
			});
		}

		const body = await readBody(event);
		if (!body.applicant) {
			return createError({statusCode: 400, message: "No applicant provided"});
		}

		const bodyApplicant: IApplicant = body.applicant;

		// Add Author
		if (!user) {
			throw createError({statusCode: 400, message: "No user provided"});
		}

		bodyApplicant.createdBy = user._id;
		bodyApplicant.createdAt = new Date();

		// Check if applicant already exists
		const existingApplicant = await ApplicantSchema.findOne({
			name: bodyApplicant.name,
		});

		if (existingApplicant) {
			return createError({
				statusCode: 409,
				message: "Applicant already exists",
			});
		}

		console.log("Creating applicant", bodyApplicant);

		const applicant = await ApplicantSchema.create(bodyApplicant);

		if (!applicant) {
			throw createError({statusCode: 500, message: "Internal Server Error"});
		}

		// Apply applicant to resolutions
		// (add applicant to resolution.body.applicants)
		for (const resolutionId of bodyApplicant.resolutions) {
			const resolution = await ResolutionSchema.findOneAndUpdate(
				{_id: resolutionId},
				{$push: {"body.applicants": applicant._id}},
				{new: true}
			);

			if (!resolution) {
				throw createError({
					statusCode: 500,
					message: "Failed to update referenced resolutions",
				});
			}
		}

		console.log(`Applicant ${applicant._id} created`);

		return {statusCode: 200, success: true, id: applicant._id};
	} catch (e) {
		console.error(e);
		throw createError({
			statusCode: 500,
			message: "here error",
		});
	}
});
