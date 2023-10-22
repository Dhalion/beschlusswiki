import {load} from "ts-dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import router from "./router";
import * as fs from "fs";
import http from "http";
import * as https from "https";
import {allowedOrigins} from "helpers/allowedOrigins";

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

const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// Enforce HTTPS
app.use("/", router);

// Heartbeat endpoint
app.get("/", (req, res) => {
	res.send("Hello World!");
});

const server: http.Server | https.Server = (() => {
	if (env.ENVIRONMENT != "production") {
		const options = {
			key: fs.readFileSync(env.SSL_KEY),
			cert: fs.readFileSync(env.SSL_CERT),
			passphrase: env.SSL_KEY_PASSWORD,
		};
		return https.createServer(options, app);
	} else {
		return http.createServer(app);
	}
})();

mongoose.connect(env.MONGO_URI, {dbName: "beschlusswiki"});
mongoose.connection.on("error", (err: Error) => {
	console.error(`MongoDB connection error: ${err}`);
	process.exit(1);
});

export default server;
