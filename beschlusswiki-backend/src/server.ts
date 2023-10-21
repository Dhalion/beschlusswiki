import express, {Express} from "express";
import router from "./router";
import cors from "cors";
import * as fs from "fs";
import * as https from "https";
import {load} from "ts-dotenv";
import {env} from "./app";

export function createServer(): https.Server {
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

	const options = {
		key: fs.readFileSync(env.SSL_KEY),
		cert: fs.readFileSync(env.SSL_CERT),
		passphrase: env.SSL_KEY_PASSWORD,
	};

	const server = https.createServer(options, app);

	return server;
}

export function startServer(server: https.Server, port: number): void {
	server.listen(port, () => {
		console.log(`${Date()} [SERVER] is listening on port ${port}`);
	});
}

export function stopServer(server: https.Server): void {
	server.close();
}
