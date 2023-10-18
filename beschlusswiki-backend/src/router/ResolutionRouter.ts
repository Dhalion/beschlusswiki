import express from "express";
import * as ResolutionController from "../controllers/ResolutionController";
import authenticate, {requireRole} from "../middleware/authenticate";
import {UserRoles} from "../db/UserSchema";

export default (router: express.Router) => {
	//? GET /resolution
	router.get("/resolution", ResolutionController.getResolution);
	//? POST /resolution
	router.post("/resolution", ResolutionController.postResolution);
	//? PUT /resolution
	router.put("/resolution", ResolutionController.putResolution);

	//? PATCH /resolution
	router.patch(
		"/resolution",
		authenticate,
		requireRole([UserRoles.Editor]),
		ResolutionController.patchResolution
	);

	//? DELETE /resolution
	router.delete(
		"/resolution",
		authenticate,
		requireRole([UserRoles.Admin]),
		ResolutionController.deleteResolution
	);
	// Test hash function
	router.get("/hash", ResolutionController.getHash);
};
