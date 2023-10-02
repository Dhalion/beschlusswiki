import express from "express";
import {ResolutionModel, getAllResolutions} from "../db/Schemas";
import mongoose from "mongoose";
import {
	searchResolutionByQuery,
	parseQueryOptions,
	ParsingError,
	postResolutionToDB,
	InvalidResolutionError,
} from "../services/resolution";

import * as ResolutionService from "../services/ResolutionService";

//! #################################
//! #    THIS FILE IS DEPRECATED    #
//! #################################

export const searchResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const searchQuery = req.query.q?.toString();
		if (!searchQuery) {
			return res.status(400).json({message: "Bad request"}).end();
		}
		const queryOptions = parseQueryOptions(req.query);
		const results = await searchResolutionByQuery(queryOptions);
		// const results = await searchResolutionByQuery(searchQuery);
		return res.json(results).status(200).end();
	} catch (error: any) {
		if (error instanceof ParsingError) {
			console.error(error);
			return res.status(400).json({message: "Invalid Query"}).end();
		}
		console.error(error);
		return res.status(500).json({message: "Internal server error"});
	}
};

export const getResolutions = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const resolutionID = req.query.id?.toString();
		if (resolutionID) {
			return res.status(501).json({message: "Not implemented"}).end();
		}
		res.json(await getAllResolutions());
		return res.status(200).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Internal server error"});
	}
};

export const postResolution = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Check if the request body is valid. Must contain a "resolution" field as json
		const resolution = req.body?.resolution;
		if (!resolution) {
			return res.status(400).json({message: "Bad request"}).end();
		}

		await postResolutionToDB(resolution);
		console.log(`[POST] Posted resolution ${resolution._id}`);
	} catch (error: any) {
		console.error(error);
		if (error instanceof InvalidResolutionError) {
			return res.status(400).json({message: "Invalid resolution"}).end();
		}
		if (error instanceof mongoose.Error.StrictModeError) {
			return res
				.status(400)
				.json({message: "Invalid resolution (Schema)"})
				.end();
		}
		return res.status(500).json({message: "Internal server error"});
	}
	return res.status(200).json({message: "OK"}).end();
};
