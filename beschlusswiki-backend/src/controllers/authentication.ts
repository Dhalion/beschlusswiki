import express from "express";

import {getUserByEmail, createUser} from "../db/Schemas";
import {random, authentication} from "../helpers/Helpers";

export const register = async (req: express.Request, res: express.Response) => {
	try {
		const {email, username, password} = req.body;
		if (!email || !username || !password) {
			return res.status(400).json({message: "Missing required fields"});
		}

		const user = await getUserByEmail(email);
		if (user) {
			return res.status(400).json({message: "Email already in use"});
		}

		const salt = random();
		const newUser = await createUser({
			uuid: random(),
			username,
			email,
			authentication: {
				salt,
				password: authentication(salt, password),
			},
		});

		return res.status(200).json(newUser).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Internal server error"});
	}
};
