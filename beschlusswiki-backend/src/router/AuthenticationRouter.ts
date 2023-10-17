import express, {Router} from "express";
import router from "router";

import * as AuthenticationController from "../controllers/AuthenticationController";

export default (router: Router) => {
	router.get("/auth/register", AuthenticationController.registerUser);
};
