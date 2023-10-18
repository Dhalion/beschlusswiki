import express, {Express, Request, Response} from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import {load} from "ts-dotenv";
import mongoose, {mongo} from "mongoose";
import router from "./router";
import * as fs from "fs";
import * as https from "https";
import requireHTTPS from "./middleware/requireHttps";

export const env = load({
	PORT: Number,
	MONGO_URI: String,
	SSL_KEY: String,
	SSL_CERT: String,
	SSL_KEY_PASSWORD: String,
	SERVER_SECRET: String,
});

const port = env.PORT || 3000;

const app: Express = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(express.json());

// Enforce HTTPS
app.use(requireHTTPS);

const options = {
	key: fs.readFileSync(env.SSL_KEY),
	cert: fs.readFileSync(env.SSL_CERT),
	passphrase: env.SSL_KEY_PASSWORD,
};

const server = https.createServer(options, app);

server.listen(port, () => {
	console.log(`${Date()} [SERVER] is listening on port ${port}`);
});

const MONGO_URI = env.MONGO_URI;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI, {dbName: "beschlusswiki"});
mongoose.connection.on("error", (err: Error) => {
	console.error(`MongoDB connection error: ${err}`);
	process.exit(1);
});

app.use("/", router());
