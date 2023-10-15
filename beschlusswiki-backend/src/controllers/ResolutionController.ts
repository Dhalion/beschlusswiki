import express from "express";
import mongoose from "mongoose";

import * as ResolutionService from "../services/ResolutionService";

//? Handles GET /resolution
export const getResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Get query parameters
		const id = req.query.id?.toString();
		const rId = req.query.rid?.toString();
		const rCode = req.query.rcode?.toString();
		const query = req.query.q?.toString();

		if (query) {
			const results = await ResolutionService.search(req.query);
			if (!results) {
				return res.status(404).json({message: "No Resolutions found"}).end();
			}
			return res.json(results).status(200).end();
		}

		if (id) {
			const result = await ResolutionService.findById(id);
			if (!result) {
				return res.status(404).json({message: "Resolution not found"}).end();
			}
			return res.json(result).status(200).end();
		}

		if (rId) {
			const result = await ResolutionService.findByRID(rId);
			if (!result) {
				return res.status(404).json({message: "Resolution not found"}).end();
			}
			return res.json(result).status(200).end();
		}

		if (rCode) {
			const result = await ResolutionService.findByRCode(rCode);
			if (!result) {
				return res.status(404).json({message: "Resolution not found"}).end();
			}
			return res.json(result).status(200).end();
		}

		// If no query parameters are given, return all resolutions
		const results = await ResolutionService.findAll();
		return res.json(results).status(200).end();
	} catch (error) {
		console.error(error);
		if (error instanceof ResolutionService.InvalidSearchQueryError) {
			return res.status(400).json({message: "Invalid Query"}).end();
		}

		return res.status(500).json({message: "Internal server error"});
	}
};

//? Handles POST /resolution
//? Only acceps new resolutions. Duplicate resolutions will be rejected
export const postResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const resolution = req.body?.resolution;
		if (!resolution) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		await ResolutionService.postNew(resolution);
		return res.status(201).end();
	} catch (error: any) {
		console.error(error);
		if (error instanceof ResolutionService.InvalidResolutionError) {
			return res.status(400).json({message: "Invalid resolution"}).end();
		}
		return res.status(500).json({message: "Internal server error"});
	}
};

//? Handles PUT /resolution
//? Updates an existing resolution, creates a copy with reference to parent
export const putResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const id = req.query.id?.toString();
		const resolution = req.body?.resolution;
		if (!id || !resolution) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		await ResolutionService.updateById(id, resolution);
		console.log("Resolution " + id + " updated");
		return res.status(200).end();
	} catch (error: any) {
		console.error(error);
		if (error instanceof ResolutionService.InvalidResolutionError) {
			return res.status(400).json({message: "Invalid resolution"}).end();
		}
		return res.status(500).json({message: "Internal server error"});
	}
};

//? Handles DELETE /resolution
//? Deletes a resolution by id
export const deleteResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const id = req.query.id?.toString();
		if (!id) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		await ResolutionService.deleteById(id);
		console.log("Resolution " + id + " deleted");
		return res.status(200).end();
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: "Internal server error"});
	}
};

//? Handles PATCH /resolution
//? Updates a single field in a resolution
export const patchResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const id = req.query.id?.toString();
		const field = req.body?.field?.toString();
		const value = req.body?.value?.toString();
		if (!id || !field || !value) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		await ResolutionService.updateField(id, field, value);
		console.log("Resolution " + id + " updated");
		return res.status(200).end();
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: "Internal server error"});
	}
};

export const getHash = async (req: express.Request, res: express.Response) => {
	try {
		const id = req.query?.id?.toString();
		if (!id) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		// fetch resolution with id
		const resolution = await ResolutionService.findById(id);
		if (!resolution) {
			return res.status(404).json({message: "Resolution not found"}).end();
		}
		const hash = resolution.createHash();
		const str = resolution.stringify();
		return res.json({hash, stringified: str}).status(200).end();
	} catch (error: any) {
		console.error(error);
		if (error instanceof ResolutionService.InvalidResolutionError) {
			return res.status(400).json({message: "Invalid resolution"}).end();
		}
		return res.status(500).json({message: "Internal server error"});
	}
};

// 12ab2023-DEMO1aaaaDemo1DEMO1Admin2023Demo00ffDemotext Lorem ipsum dolor sit amet.
// 12ab2023-DEMO1aaaaDemo1DEMO1Admin2023Demo00ffDemotext Lorem ipsum dolor sit amet.
