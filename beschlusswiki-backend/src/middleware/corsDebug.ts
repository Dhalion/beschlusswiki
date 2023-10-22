import {Request, Response, NextFunction} from "express";

export default function corsDebug(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.on("finish", () => {
		console.log("Request headers:");
		console.log(req.headers);
		console.log("Response headers:");
		console.log(res.getHeaders());
	});
	next();
}
