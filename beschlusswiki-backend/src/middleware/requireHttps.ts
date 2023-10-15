import {Request, Response, NextFunction} from "express";

//? Middleware to redirect http requests to https
export default function requireHTTPS(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// Wenn die Anfrage nicht über HTTPS erfolgt, leite sie auf HTTPS um
	if (!req.secure) {
		return res.redirect("https://" + req.headers.host + req.url);
	}
	next();
}
