import express from "express";

import authentication from "./authentication";
import resolution from "./ResolutionRouter";

const router = express.Router();

export default (): express.Router => {
	authentication(router);
	resolution(router);
	return router;
};
