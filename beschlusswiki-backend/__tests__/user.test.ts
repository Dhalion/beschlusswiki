import request from "supertest";
import app from "../src/app";
import * as crypto from "crypto";
import mongoose from "mongoose";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Dies deaktiviert die Überprüfung des SSL-Zertifikats

const username = "testuser" + crypto.randomBytes(8).toString("hex");
const password = crypto.randomBytes(32).toString("hex");

describe("POST /auth/register", () => {
	describe("with no body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/auth/register");
			expect(res.status).toBe(400);
		});
	});

	describe("with empty body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/auth/register").send({});
			expect(res.status).toBe(400);
		});
	});

	describe("with valid body", () => {
		test("should return 201 Created", async () => {
			const res = await request(app)
				.post("/auth/register")
				.send({username, password});
			expect(res.status).toBe(201);
		});

		test("should return 400 Bad Request on duplicate", async () => {
			const res = await request(app)
				.post("/auth/register")
				.send({username, password});
			expect(res.status).toBe(400);
		});
	});
});

describe("POST /auth/login", () => {
	describe("with no body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/auth/login");
			expect(res.status).toBe(400);
		});
	});

	describe("with empty body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/auth/login").send({});
			expect(res.status).toBe(400);
		});
	});

	describe("with valid body", () => {
		test("should return 200 OK", async () => {
			const res = await request(app)
				.post("/auth/login")
				.send({username, password});
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
		});

		test("should return 401 Unauthorized on invalid credentials", async () => {
			const res = await request(app)
				.post("/auth/login")
				.send({username, password: "wrongpassword"});
			expect(res.status).toBe(401);
		});
	});
});
