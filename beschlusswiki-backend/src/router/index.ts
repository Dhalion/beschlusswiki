import express from "express";

import ResolutionRouter from "./ResolutionRouter";
import AuthenticationRouter from "./AuthenticationRouter";

const router = express.Router();

router.use("/auth", AuthenticationRouter);
router.use("/resolution", ResolutionRouter);

export default router;
