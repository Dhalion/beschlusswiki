import {UserRoles, UserModel} from "../db/UserSchema";
import crypto from "crypto";
import bcrypt from "bcrypt";

const MAGIC_TOKEN = "ABABABABABAB";

export class InvalidTokenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidRegistrationTokenError";
		Object.setPrototypeOf(this, InvalidTokenError.prototype);
	}
}

export class UsernameAlreadyTakenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UsernameAlreadyTakenError";
		Object.setPrototypeOf(this, UsernameAlreadyTakenError.prototype);
	}
}

export async function registerUser(
	username: string,
	password: string,
	registrationToken: string | undefined
) {
	try {
		// Check if username is already taken
		if (await UserModel.exists({username})) {
			throw new UsernameAlreadyTakenError("Username already taken");
		}

		// Validate registration token if provided
		if (registrationToken) {
			//? Check if registration token is valid
			if (registrationToken !== MAGIC_TOKEN) {
				throw new InvalidTokenError("Invalid registration token");
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new User
		const newUser = new UserModel({
			// generate random 6 digit hex id
			id: crypto.randomBytes(3).toString("hex"),
			username: username,
			roles: UserRoles.Admin,
			status: registrationToken ? true : false,
			authentication: {
				passwordHash: hashedPassword,
			},
		});
		await newUser.save();
	} catch (err) {
		// Pass the error up
		console.log(err);
		throw err;
	}
}
