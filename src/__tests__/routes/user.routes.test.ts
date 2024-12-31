import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

describe("User Endpoints", () => {
	// Test for GET /users
	it("should retrieve all users", async () => {
		const res = await request(app).get("/users");

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("results");
		expect(res.body.results).toBeInstanceOf(Object);
	});

	// Test for GET /users/id/:id
	it("should retrieve a user by ID", async () => {
		const userId = "6772cf072b64c4cbb54cf863"; // Replace with a valid user ID from your database
		const res = await request(app).get(`/users/id/${userId}`);

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("user");
		expect(res.body.user).toHaveProperty("id", userId);
	});

	// Test for GET /users/find?query
	it("should retrieve a user by query", async () => {
		const query = { username: "mariab" }; // Replace with a valid query
		const res = await request(app).get("/users/find").query(query);

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
			.send(updatedData);

		expect(res.status).toBe(HttpStatusCode.CREATED);
		expect(res.body.user).toHaveProperty("username", updatedData.username);
	});

	// Test for DELETE /users/delete/:id
	it("should delete a user by ID", async () => {
		const userId = "67740d7688dcf111ae6eda34"; // Replace with a valid user ID
		const res = await request(app).delete(`/users/delete/${userId}`);

		expect(res.status).toBe(HttpStatusCode.OK);
		expect(res.body).toHaveProperty("message", "User deleted successfully");
	});
});
