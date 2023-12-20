import {Request, Response} from "express";
import * as AuthenticationService from "../services/AuthenticationService";
import {UserModel} from "db/UserSchema";

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

export const getSession = async (req: Request, res: Response) => {
	console.log(`[AUTH] User requested session`);

	return res.status(200).json({success: true, session: "hello world"}).end();
};

export const getUsers = async (req: Request, res: Response) => {
	console.log(`[AUTH] User requested users`);

	try {
		const users = await AuthenticationService.getUsers();
		console.log(`[AUTH] Users fetched successfully`);
		return res.status(200).json({users}).end();
	} catch (err) {
		return res.status(500).json({message: "Error"}).end();
	}
};

export const patchUser = async (req: Request, res: Response) => {
	console.log(`[AUTH] User requested to patch user`);
	const userId = req.query?.id?.toString();
	const field = req.query?.field?.toString();
	const value = req.query?.value?.toString();

	if (!userId || !field || !value) {
		return res.status(400).json({message: "Bad request"}).end();
	}

	try {
		const users = await AuthenticationService.patchUser(userId, field, value);
		console.log(`[AUTH] Users patched successfully`);
		return res.status(200).json({users}).end();
	} catch (err) {
		console.log(err);
		if (err instanceof AuthenticationService.InvalidFieldError) {
			return res.status(400).json({message: "Invalid field"}).end();
		}
		return res.status(500).json({message: "Error"}).end();
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	console.log(`[AUTH] User requested to delete user`);
	const userId = req.query?.id?.toString();

	if (!userId) {
		return res.status(400).json({message: "Missing User ID"}).end();
	}

	try {
		const users = await AuthenticationService.deleteUser(userId);
		console.log(`[AUTH] User ${userId} deleted successfully`);
		return res.status(200).end();
	} catch (err) {
		console.log(err);
		if (err instanceof AuthenticationService.UserNotFoundError) {
			return res.status(404).json({message: "User not found"}).end();
		}
		return res.status(500).json({message: "Error"}).end();
	}
};

export const createUser = async (req: Request, res: Response) => {
	console.log(`[AUTH] User requested to create user`);
	const username = req.body?.username?.toString();
	const password = req.body?.password?.toString();
	const roles = req.body?.roles;
	const status = req.body?.enabled;

	if (!username || !password || !roles || !status) {
		return res.status(400).json({message: "Bad request"}).end();
	}

	try {
		const user = await AuthenticationService.createUser(
			username,
			password,
			roles,
			status
		);
		console.log(`[AUTH] User ${username} created successfully`);
		return res.status(200).end();
	} catch (err) {
		console.log(err);
		if (err instanceof AuthenticationService.UsernameAlreadyTakenError) {
			return res.status(400).json({message: "Username already taken"}).end();
		}
		return res.status(500).json({message: "Error"}).end();
	}
};
