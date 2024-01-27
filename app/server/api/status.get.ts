import mongoose from "mongoose";
import {
	type ApiStatusData,
	type ElasticStatusResponse,
} from "~/types/Interfaces";

/**
 * Connection ready state
 *
 * - 0 = disconnected
 * - 1 = connected
 * - 2 = connecting
 * - 3 = disconnecting
 * - 99 = uninitialized
 */
export default defineEventHandler(async (): Promise<ApiStatusData> => {
	return {
		db: mongoose.connection.readyState,
		es: null,
		api: 1,
	};
});
