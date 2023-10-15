import express from "express";

import resolution from "./ResolutionRouter";

const router = express.Router();

export default (): express.Router => {
	resolution(router);
	return router;
};
