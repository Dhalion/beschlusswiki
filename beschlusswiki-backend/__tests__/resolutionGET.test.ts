// @ts-nocheck
import supertest from "supertest";
import request from "supertest";
import app from "../src/app";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Dies deaktiviert die Überprüfung des SSL-Zertifikats

describe("GET /resolution", () => {
	describe("with no queryParams", () => {
		test("should return 200 OK", async () => {
			const res = await request(app).get("/resolution");
			expect(res.status).toBe(200);
		});
	});

	describe("with id queryParam", () => {
		describe("with valid id", () => {
			const resId = "651b0bf014818dc6895dfb83";
			test("should return 200 OK", async () => {
				const res = await request(app).get("/resolution?id=" + resId);
				expect(res.status).toBe(200);
			});
			test("should have resolutio body with id " + resId, async () => {
				const res = await request(app).get("/resolution?id=" + resId);
				expect(res.body._id).toBe(resId);
			});
		});

		describe("with invalid id", () => {
			const resId = "abc";
			test("should return 400 Invalid Request", async () => {
				const res = await request(app).get("/resolution?id=" + resId);
				expect(res).toHaveProperty("status", 400);
			});
		});

		describe("with non-existent id", () => {
			const resId = "000000000000000000000000";
			test("should return 404 Not Found", async () => {
				const res = await request(app).get("/resolution?id=" + resId);
				expect(res?.status).toBe(404);
			});
		});
	});

	describe("with rid queryParam", () => {
		describe("with valid rid", () => {
			const resRid = "12ae";
			test("should return 200 OK", async () => {
				const res = await request(app).get("/resolution?rid=" + resRid);
				expect(res.status).toBe(200);
			});
			test("should have resolutio body with rid " + resRid, async () => {
				const res = await request(app).get("/resolution?rid=" + resRid);
				expect(res.body.rid).toBe(resRid);
			});
		});

		describe("with non-existent rid", () => {
			const resRid = "123456";
			test("should return 404 Not Found", async () => {
				const res = await request(app).get("/resolution?rid=" + resRid);
				expect(res?.status).toBe(404);
			});
		});
	});

	describe("with rcode queryParam", () => {
		describe("with valid rcode", () => {
			const resRcode = "2023-DEMO3";
			test("should return 200 OK", async () => {
				const res = await request(app).get("/resolution?rcode=" + resRcode);
				expect(res.status).toBe(200);
				expect(res).toHaveProperty("body");
				expect(res.body[0]).toHaveProperty("rcode");
			});
		});

		describe("with non-existent rcode", () => {
			const resRcode = "0000-ABC123";
			test("should return 404 Not Found", async () => {
				const res = await request(app).get("/resolution?rcode=" + resRcode);
				expect(res).toHaveProperty("status", 404);
			});
		});
	});
});
