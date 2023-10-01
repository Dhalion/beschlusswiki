import {
	getResolutions,
	postResolution,
	searchResolution,
} from "../controllers/resolution";
import express from "express";

export default (router: express.Router) => {
	router.get("/resolution/search", searchResolution);
	router.get("/resolution", getResolutions);
	router.post("/resolution", postResolution);
};
