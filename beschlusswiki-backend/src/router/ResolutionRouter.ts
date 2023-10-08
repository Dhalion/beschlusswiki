import * as ResolutionController from "../controllers/ResolutionController";
import express from "express";

export default (router: express.Router) => {
	//? GET /resolution
	router.get("/resolution", ResolutionController.getResolution);
	//? POST /resolution
	router.post("/resolution", ResolutionController.postResolution);
	//? PUT /resolution
	router.put("/resolution", ResolutionController.putResolution);
	// Test hash function
	router.get("/hash", ResolutionController.getHash);
};
