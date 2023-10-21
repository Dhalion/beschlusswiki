import express, {Express} from "express";
import router from "./router";
import cors from "cors";
import * as fs from "fs";
import * as https from "https";
import {load} from "ts-dotenv";
import {env} from "./app";
import http from "http";

export function createServer(): https.Server | http.Server {
	const app: Express = express();

	app.use(
		cors({
			credentials: true,
		})
	);

	app.use(express.json());

	// Enforce HTTPS
	app.use("/", router);

	// Heartbeat endpoint
	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	const options = {};
	if (env.ENVIRONMENT != "production") {
		const options = {
			key: fs.readFileSync(env.SSL_KEY),
			cert: fs.readFileSync(env.SSL_CERT),
			passphrase: env.SSL_KEY_PASSWORD,
		};
		const server = https.createServer(options, app);
		return server;
	} else {
		const server = http.createServer(app);
		return server;
	}
}

export function startServer(
	server: https.Server | http.Server,
	port: number
): void {
	server.listen(port, () => {
		console.log(`${Date()} [SERVER] is listening on port ${port}`);
	});
}

export function stopServer(server: https.Server): void {
	server.close();
}
