import express from "express";

import * as AuthenticationController from "../controllers/AuthenticationController";

const router = express.Router();

// Authentication routes
router.post("/register", AuthenticationController.registerUser);
router.post("/login", AuthenticationController.loginUser);
router.get("/session", AuthenticationController.getSession);

// User routes
router.get("/user", AuthenticationController.getUsers);
router.post("/user", AuthenticationController.createUser);
router.patch("/user", AuthenticationController.patchUser);
router.delete("/user", AuthenticationController.deleteUser);
export default router;
