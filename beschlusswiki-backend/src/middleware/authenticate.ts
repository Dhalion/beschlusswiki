import jwt from "jsonwebtoken";
import {env} from "../index";
import {Request, Response, NextFunction} from "express";

//? Middleware to check if a user is authenticated
export default function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({message: "Unauthorized"}).end();
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({message: "Unauthorized"}).end();
	}

	const decoded = jwt.verify(token, env.SERVER_SECRET, (err, user) => {
		if (err) {
			return res.status(401).json({message: "Unauthorized"}).end();
		}
		res.locals.user = user;
		return user;
	});
	return next();
}

export function requireRole(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return res.status(401).json({message: "Unauthorized"}).end();
		}
		// Check if users roles include one of the required roles
		const userRoles = user.roles;
		const hasPermission = userRoles.some((userRole: string) => {
			return roles.includes(userRole);
		});
		if (!hasPermission) {
			return res.status(403).json({message: "Insufficient privileges"}).end();
		}
		return next();
	};
}
