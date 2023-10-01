import express, {Express, Request, Response} from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import {load} from "ts-dotenv";
import mongoose, {mongo} from "mongoose";
import router from "./router";

const env = load({
	PORT: Number,
	MONGO_URI: String,
});

const port = env.PORT || 3000;

const app: Express = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(express.json());

app.listen(port, () => {
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
