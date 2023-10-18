import express, {Router} from "express";
import router from "router";

import * as AuthenticationController from "../controllers/AuthenticationController";

export default (router: Router) => {
	router.post("/auth/register", AuthenticationController.registerUser);
	router.post("/auth/login", AuthenticationController.loginUser);
};
