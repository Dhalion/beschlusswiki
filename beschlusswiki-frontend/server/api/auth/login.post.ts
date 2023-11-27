import {UserSchema} from "~/types/models/user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const body = await readBody(event);

	const username = body?.username;
	const password = body?.password;

	if (!username || !password) {
		return new Response("Missing username or password", {status: 400});
	}

	const user = await UserSchema.findOne({username}).select(
		"+authentication.passwordHash"
	);

	if (!user) {
		return new Response("User not found", {status: 404});
	}

	const passwordMatch = bcrypt.compare(
		password,
		user?.authentication.passwordHash.toString()
	);

	if (!passwordMatch) {
		return new Response("Unauthorized", {status: 401});
	}

	// Generate JWT token
	const token = jwt.sign(
		{
			user: user,
		},
		config.serverSecret,
		{
			expiresIn: "10min",
		}
	);
	console.log(`User ${user.username} has logged in`);

	return {token: token};
});
