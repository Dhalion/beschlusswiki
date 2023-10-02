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

type TimedFunctionResult<T> = {
	result: T;
	time: number;
};

export function measureExecutionTime<T>(
	func: (...args: any[]) => T,
	...args: any[]
): TimedFunctionResult<T> {
	const start = performance.now();
	const result = func(...args);
	const end = performance.now();
	const time = end - start;
	return {
		result,
		time,
	};
}
