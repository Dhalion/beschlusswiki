import express from "express";

import ResolutionRouter from "./ResolutionRouter";
import AuthenticationRouter from "./AuthenticationRouter";
import CategoryRouter from "./CategoryRouter";

const router = express.Router();

router.use("/auth", AuthenticationRouter);
router.use("/resolution", ResolutionRouter);
router.use("/category", CategoryRouter);

export default router;
