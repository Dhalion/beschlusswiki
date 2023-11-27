export default defineEventHandler(async (event) => {
	if (!event.context.authorization) {
		return new Response("Unauthorized", {status: 401});
	}

	// Fetch user data from database

	return new Response(event.context.token, {status: 200});
});
