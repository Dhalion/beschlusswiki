import express from "express";

import ResolutionRouter from "./ResolutionRouter";
import AuthenticationRouter from "./AuthenticationRouter";

const router = express.Router();

export default (): express.Router => {
	ResolutionRouter(router);
	AuthenticationRouter(router);
	return router;
};
