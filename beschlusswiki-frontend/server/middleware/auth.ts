import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
	const config = useRuntimeConfig();

	const token = getHeader(event, "Authorization")?.split(" ")[1];
	console.log(`Request to ${event.path} with token ${token}`);
	if (token) {
		try {
			const decoded = jwt.verify(token, config.serverSecret);
			event.context.authorization = decoded;
			event.context.token = token;
		} catch (error) {
			// ignore
		}
	}
});
