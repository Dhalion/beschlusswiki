import {Router} from "express";
import * as CategoryController from "../controllers/CategoryController";

const router = Router();

//? GET /category
router.get("/", CategoryController.getCategory);

export default router;
