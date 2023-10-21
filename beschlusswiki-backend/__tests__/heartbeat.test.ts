import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
	test("should return 200 OK", async () => {
		const res = await request(app).get("/");
		expect(res.status).toBe(200);
	});
	test("should return Hello World!", async () => {
		const res = await request(app).get("/");
		expect(res.text).toBe("Hello World!");
	});
});
