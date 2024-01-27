import jwt from "jsonwebtoken";
import {type JWTSesssionData} from "~/types/Interfaces";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const token = getHeader(event, "Authorization")?.split(" ")[1];
	console.log(`${event.method} ${event.path} with token ${token}`);

	if (token) {
		try {
			const sessionData: JWTSesssionData = jwt.verify(
				token,
				config.serverSecret
			) as JWTSesssionData;
			console.log(`Session for ${sessionData.user.username} is valid`);
			event.context.authorization = sessionData;
			event.context.token = token;
		} catch (error) {
			// ignore
		}
	}
});
