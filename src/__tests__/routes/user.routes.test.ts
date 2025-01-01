import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

jest.mock("../../api/middlewares/auth.middleware", () => ({
	authenticateToken: jest.fn((req, res, next) => {
		// Ensure the Authorization header is present
		const authHeader = req.headers["authorization"];
		if (!authHeader) {
			return res
				.status(HttpStatusCode.UNAUTHORIZED)
				.json({ error: "Access Denied. Token Missing." });
		}

		// Extract token part from "Bearer <token>"
		const token = authHeader.split(" ")[1];
		if (!token) {
			return res
				.status(HttpStatusCode.UNAUTHORIZED)
				.json({ error: "Access Denied. Token Missing." });
		}

		// Simulate a valid token
		if (token === "valid_token") {
			// Mock the user object that would be decoded from the valid token
			req.user = { id: "mockUserId", username: "mockUser" };
			return next(); // Token is valid, proceed to the next middleware or route handler
		}

		// Simulate an invalid token
		return res
			.status(HttpStatusCode.UNAUTHORIZED)
			.json({ error: "Invalid Token" });
	}),
}));

describe("User Endpoints", () => {
	// Test middleware
	describe("GET /users", () => {
		it("should allow access with valid token", async () => {
			const response = await request(app)
				.get("/users") // Replace with your route
				.set("Authorization", "Bearer valid_token"); // Valid token

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});
	});

	describe("GET /users", () => {
		it("should deny access without token", async () => {
			const response = await request(app).get("/users"); // No token

			expect(response.status).toBe(401);
		});

		it("should deny access with invalid token", async () => {
			const response = await request(app)
				.get("/users")
				.set("Authorization", "Bearer invalidtoken"); // Invalid token

			expect(response.status).toBe(401);
		});
	});

	// Test for GET /users
	it("should retrieve all users", async () => {
		const res = await request(app)
			.get("/users")
			.set("Authorization", "Bearer valid_token"); // Valid token;

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("results");
		expect(res.body.results).toBeInstanceOf(Object);
	});

	// Test for GET /users/id/:id
	it("should retrieve a user by ID", async () => {
		const userId = "6772cf072b64c4cbb54cf863"; // Replace with a valid user ID from your database
		const res = await request(app)
			.get(`/users/id/${userId}`)
			.set("Authorization", "Bearer valid_token"); // Valid token;

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("user");
		expect(res.body.user).toHaveProperty("id", userId);
	});

	// Test for GET /users/find?query
	it("should retrieve a user by query", async () => {
		const query = { username: "mariab" }; // Replace with a valid query
		const res = await request(app)
			.get("/users/find")
			.query(query)
			.set("Authorization", "Bearer valid_token"); // Valid token;

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("user");
		expect(res.body.user).toHaveProperty("username", query.username);
	});

	// Test for PUT /users/update/:id
	it("should update a user by ID", async () => {
		const userId = "6772cf072b64c4cbb54cf863"; // Replace with a valid user ID
		const updatedData = { username: "john_updated" };
		const res = await request(app)
			.put(`/users/update/${userId}`)
			.set("Authorization", "Bearer valid_token") // Valid token
			.send(updatedData);

		expect(res.status).toBe(HttpStatusCode.CREATED);
		expect(res.body.user).toHaveProperty("username", updatedData.username);
	});

	// Test for DELETE /users/delete/:id
	it("should delete a user by ID", async () => {
		const userId = "6772cf072b64c4cbb54cf863"; // Replace with a valid user ID
		const res = await request(app)
			.delete(`/users/delete/${userId}`)
			.set("Authorization", "Bearer valid_token"); // Valid token;

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("message", "User deleted successfully");
	});
});
