import {IResolutionDocument, ResolutionModel} from "../db/ResolutionSchema";
import {CategoryModel, ICategoryDocument} from "../db/CategorySchema";

export class CategoryNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CategoryNotFoundError";
		Object.setPrototypeOf(this, CategoryNotFoundError.prototype);
	}
}

export class ResolutionNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ResolutionNotFoundError";
		Object.setPrototypeOf(this, ResolutionNotFoundError.prototype);
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

export async function addResolutionToCategory(
	categoryId: string,
	resolutionId: string
) {
	try {
		// Get the resolution
		const resolution = await ResolutionModel.findById(resolutionId);
		if (!resolution) {
			throw new ResolutionNotFoundError("Resolution not found");
		}

		// Get the category
		return await CategoryModel.findByIdAndUpdate(
			categoryId,
			{
				$addToSet: {resolutions: resolution._id},
			},
			{new: true}
		);
	} catch (error) {
		throw error;
	}
}

export async function removeResolutionFromCategory(
	categoryId: string,
	resolutionId: string
) {
	try {
		// Get the resolution
		const resolution = await ResolutionModel.findById(resolutionId);
		if (!resolution) {
			throw new ResolutionNotFoundError("Resolution not found");
		}

		// Get the category
		return await CategoryModel.findByIdAndUpdate(
			categoryId,
			{
				$pull: {resolutions: resolution._id},
			},
			{new: true}
		);
	} catch (error) {
		throw error;
	}
}
