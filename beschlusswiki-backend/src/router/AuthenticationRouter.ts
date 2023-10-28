import express from "express";

import * as AuthenticationController from "../controllers/AuthenticationController";

const router = express.Router();

router.post("/register", AuthenticationController.registerUser);
router.post("/login", AuthenticationController.loginUser);
router.get("/session", AuthenticationController.getSession);
router.get("/user", AuthenticationController.getUsers);
router.patch("/user", AuthenticationController.patchUser);
router.delete("/user", AuthenticationController.deleteUser);
export default router;
