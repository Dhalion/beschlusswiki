import {Request, Response} from "express";
import * as AuthenticationService from "../services/AuthenticationService";

export const registerUser = async (req: Request, res: Response) => {
	const username = req.body?.username?.toString();
	const password = req.body?.password?.toString();
	const registrationToken = req.body?.registrationToken?.toString();

	if (!username || !password) {
		return res.status(400).json({message: "Bad request"}).end();
	}

	try {
		await AuthenticationService.registerUser(
			username,
			password,
			registrationToken
		);
	} catch (err) {
		if (err instanceof AuthenticationService.InvalidTokenError) {
			return res
				.status(400)
				.json({message: "Invalid registration token"})
				.end();
		}
		if (err instanceof AuthenticationService.UsernameAlreadyTakenError) {
			return res.status(400).json({message: "Username already taken"}).end();
		}
		return res.status(400).json({message: "Bad request"}).end();
	}
	console.log(`[AUTH] User ${username} created successfully`);
	return res.status(200).json({username, password}).end();
};
