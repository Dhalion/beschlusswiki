import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
	const config = useRuntimeConfig();

	const token = getHeader(event, "Authorization")?.split(" ")[1];

	if (token) {
		try {
			const decoded = jwt.verify(token, config.serverSecret);
			event.context.authorization = decoded;
		} catch (error) {
			// ignore
		}
	}
});
