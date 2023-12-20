import {Router} from "express";
import * as CategoryController from "../controllers/CategoryController";

const router = Router();

//? GET /category
router.get("/", CategoryController.getCategory);
router.patch("/", CategoryController.patchCategory);

export default router;
