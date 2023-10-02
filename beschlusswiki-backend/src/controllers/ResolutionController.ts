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
