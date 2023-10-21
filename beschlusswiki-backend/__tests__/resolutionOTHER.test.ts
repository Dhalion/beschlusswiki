import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Dies deaktiviert die Überprüfung des SSL-Zertifikats

// Variable to store created resolution id
let createdID: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
	"6533bf3b0a95b412308cfcbe"
);

const resolution = {
	rid: "1234",
	rcode: "2023-TEST1",
	parent: null,
	body: {
		title: "TEST1",
		tag: "TEST1",
		applicants: ["Admin"],
		year: 2023,
		category: {
			name: "TEST",
			id: "00ff",
		},
		text: "Demotext Lorem ipsum dolor sit amet.",
	},
};

describe("POST /resolution", () => {
	describe("with no body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/resolution");
			expect(res.status).toBe(400);
		});
	});

	describe("with empty body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).post("/resolution").send({});
			expect(res.status).toBe(400);
		});
	});

	describe("with valid body", () => {
		test("should return 201 Created", async () => {
			const res = await request(app).post("/resolution").send({resolution});
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("id");
			createdID = res?.body?.id ? res.body.id : undefined;
		});

		test("should return 400 Bad Request on duplicate", async () => {
			const res = await request(app)
				.post("/resolution")
				.send({resolution: resolution});
			expect(res.status).toBe(400);
		});
	});
});

describe("PUT /resolution", () => {
	describe("with no id in query params", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).put("/resolution");
			expect(res.status).toBe(400);
		});
	});

	describe("with non-existent id in query params", () => {
		test("should return 404 Not Found", async () => {
			const res = await request(app)
				.put("/resolution?id=000000000000000000000000")
				.send({resolution});
			expect(res.status).toBe(404);
		});
	});

	describe("with invalid id in query params", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).put("/resolution?id=abc");
			expect(res.status).toBe(400);
		});
	});

	describe("with valid id but empty body", () => {
		test("should return 400 Bad Request", async () => {
			const res = await request(app).put("/resolution?id=" + createdID);
			expect(res.status).toBe(400);
		});
	});

	describe("with valid id and valid body", () => {
		resolution.body.title = "TEST2";
		test("should return 200 OK", async () => {
			const res = await request(app)
				.put("/resolution?id=" + createdID)
				.send({resolution});
			expect(res.status).toBe(200);
		});
	});
});

describe("DELETE /resolution", () => {
	describe("with no authentication", () => {
		test("should return 401 Unauthorized", async () => {
			const res = await request(app).delete("/resolution?id=" + createdID);
			expect(res.status).toBe(401);
		});
	});

	describe("with invalid authentication", () => {
		test("should return 401 Unauthorized", async () => {
			const res = await request(app)
				.delete("/resolution?id=" + createdID)
				.set("Authorization", "Bearer abc");
			expect(res.status).toBe(401);
		});
	});
});
