import {Request, Response} from "express";

import * as CategoryService from "../services/CategoryService";

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
