import {CategoryModel} from "../db/CategorySchema";

export class CategoryNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CategoryNotFoundError";
		Object.setPrototypeOf(this, CategoryNotFoundError.prototype);
	}
}

export async function findAll() {
	try {
		return await CategoryModel.find();
	} catch (error) {
		throw error;
	}
}

export async function findById(id: string) {
	try {
		const result = await CategoryModel.findById(id);
		return result;
	} catch (error) {
		throw error;
	}
}
