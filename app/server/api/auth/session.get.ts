import {type SessionData} from "~/types/Interfaces";

export default defineEventHandler(async (event) => {
	if (!event.context.authorization) {
		return new Response("Unauthorized", {status: 401});
	}

	// Fetch user data from database
	const sessionData: SessionData = event.context.authorization;
	delete sessionData.user.authentication;

	console.log(`User ${sessionData.user.username} has requested`);

	return sessionData;
});
