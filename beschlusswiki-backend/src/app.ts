import {load} from "ts-dotenv";
import mongoose from "mongoose";
import {createServer, startServer} from "./server";

export const env = load({
	PORT: Number,
	MONGO_URI: String,
	SSL_KEY: String,
	SSL_CERT: String,
	SSL_KEY_PASSWORD: String,
	SERVER_SECRET: String,
	ENVIRONMENT: String,
});

export const port = env.PORT || 3000;

const app = createServer();

startServer(app, port);

const MONGO_URI = env.MONGO_URI;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI, {dbName: "beschlusswiki"});
mongoose.connection.on("error", (err: Error) => {
	console.error(`MongoDB connection error: ${err}`);
	process.exit(1);
});

export default app;
