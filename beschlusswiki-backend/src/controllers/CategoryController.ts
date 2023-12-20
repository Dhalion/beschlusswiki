import {Request, Response} from "express";

import * as CategoryService from "../services/CategoryService";
import {ICategoryDocument} from "db/CategorySchema";

enum PatchCategoryActions {
	Add = "add",
	Remove = "remove",
}

//? Handles GET /category
export const getCategory = async (req: Request, res: Response) => {
	try {
		const id = req.query.id?.toString();

		// Return Category with given id
		if (id) {
			const result = await CategoryService.findById(id);
			if (!result) {
				return res.status(404).json({message: "Category not found"}).end();
			}
			return res.json(result).status(200).end();
		}

		// If no query parameters are given, return all categories
		const results = await CategoryService.findAll();
		if (!results) {
			return res.status(404).json({message: "No Categories found"}).end();
		}
		return res.json(results).status(200).end();
	} catch (error) {
		// console.error(error);
		return res.status(500).json({message: "Internal Server Error"}).end();
	}
};

//? Handles PATCH /category
export const patchCategory = async (req: Request, res: Response) => {
	try {
		const categoryId = req.query.id?.toString();
		const resolutionId = req.query.resolution?.toString();
		const action =
			// Add is the default action
			req.query.action?.toString() == "remove"
				? PatchCategoryActions.Remove
				: PatchCategoryActions.Add;

		// Not checking action as add is default
		if (!categoryId || !resolutionId) {
			return res.status(400).json({message: "Invalid Request"}).end();
		}

		let success: ICategoryDocument | null = null;
		if (action == PatchCategoryActions.Add) {
			success = await CategoryService.addResolutionToCategory(
				categoryId,
				resolutionId
			);
		} else if (action == PatchCategoryActions.Remove) {
			success = await CategoryService.removeResolutionFromCategory(
				categoryId,
				resolutionId
			);
		}

		console.log(success);

		if (!success) {
			return res.status(500).json({message: "Internal Server Error"}).end();
		}

		return res.status(200).end();
	} catch (error) {
		console.error(error);
		if (error instanceof CategoryService.CategoryNotFoundError) {
			return res.status(404).json({message: "Category not found"}).end();
		}
		if (error instanceof CategoryService.ResolutionNotFoundError) {
			return res.status(404).json({message: "Resolution not found"}).end();
		}

		return res.status(500).json({message: "Internal Server Error"}).end();
	}
};
