import crypto from "crypto";
import {load} from "ts-dotenv";

const env = load({
	SECRET: String,
});

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
	return crypto
		.createHmac("sha256", [salt, password].join("/"))
		.update(env.SECRET)
		.digest("hex");
};
