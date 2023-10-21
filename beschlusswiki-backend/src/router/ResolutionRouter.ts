import express from "express";
import * as ResolutionController from "../controllers/ResolutionController";
import authenticate, {requireRole} from "../middleware/authenticate";
import {UserRoles} from "../db/UserSchema";

const router = express.Router();

//? GET /resolution
router.get("/", ResolutionController.getResolution);
//? POST /resolution
router.post("/", ResolutionController.postResolution);
//? PUT /resolution
router.put("/", ResolutionController.putResolution);

//? PATCH /resolution
router.patch(
	"/",
	authenticate,
	requireRole([UserRoles.Editor]),
	ResolutionController.patchResolution
);

//? DELETE /resolution
router.delete(
	"/",
	authenticate,
	requireRole([UserRoles.Admin]),
	ResolutionController.deleteResolution
);
// Test hash function
router.get("/hash", ResolutionController.getHash);

export default router;
