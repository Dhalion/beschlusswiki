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
	return res.status(201).json({username, password}).end();
};

export const loginUser = async (req: Request, res: Response) => {
	const username = req.body?.username?.toString();
	const password = req.body?.password?.toString();

	// Check if username and password are provided
	if (!username || !password) {
		return res.status(400).json({message: "Bad request"}).end();
	}

	try {
		const jwtToken = await AuthenticationService.loginUser(username, password);
		console.log(`[AUTH] User ${username} logged in successfully`);
		return res.status(200).json({token: jwtToken}).end();
	} catch (err) {
		if (err instanceof AuthenticationService.InvalidCredentialsError) {
			return res.status(401).json({message: "Invalid credentials"}).end();
		}
		return res.status(400).json({message: "Bad request"}).end();
	}
};
