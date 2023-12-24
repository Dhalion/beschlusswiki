import mongoose from "mongoose";
import {ElasticStatus} from "~/types/Interfaces";

/**
 * Connection ready state
 *
 * - 0 = disconnected
 * - 1 = connected
 * - 2 = connecting
 * - 3 = disconnecting
 * - 99 = uninitialized
 */
export default defineEventHandler(() => {
	return {
		db: mongoose.connection.readyState,
		es: ElasticStatus.UNKNOWN,
		api: 1,
	};
});
