import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import Task from "../../data/models/task.model";

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

describe("Task Routes Integration Tests", () => {
	let existingTaskId: string = "67731c7fbf1da59419417133"; // Change to match actual IDs

	// Test middleware
	describe("GET /tasks", () => {
		it("should allow access with valid token", async () => {
			const response = await request(app)
				.get("/tasks") // Replace with your route
				.set("Authorization", "Bearer valid_token"); // Valid token

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});
	});

	describe("GET /tasks", () => {
		it("should deny access without token", async () => {
			const response = await request(app).get("/tasks"); // No token

			expect(response.status).toBe(401);
		});

		it("should deny access with invalid token", async () => {
			const response = await request(app)
				.get("/tasks")
				.set("Authorization", "Bearer invalidtoken"); // Invalid token

			expect(response.status).toBe(401);
		});
	});

	// Test POST /tasks/new (Create a new task)
	describe("POST /tasks/new", () => {
		it("should create a new task", async () => {
			const newTask = {
				name: `New task ${Math.random() * 100}`,
				description: "This is a test task",
				users: [],
				project: "6772fdd364b7e89844146946",
				status: "Pending",
				dueDate: "2024-12-31",
			};

			const response = await request(app)
				.post("/tasks/new")
				.set("Authorization", "Bearer valid_token") // Valid token
				.send(newTask)
				.expect(HttpStatusCode.CREATED || HttpStatusCode.CONFLICT);

			expect(response.body.message).toBe("Task created successfully");
		});
	});

	// Test GET /tasks/ (Retrieve all tasks)
	describe("GET /tasks/", () => {
		it("should return a list of tasks", async () => {
			const response = await request(app)
				.get("/tasks/")
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);
			expect(response.body).toHaveProperty("results");
			expect(response.body.results).toBeInstanceOf(Object);
			expect(response.body.results.length).toBeGreaterThan(0); // Assuming there is at least one task in the database
		});
	});

	// Test GET /tasks/id/:id (Retrieve a task by ID)
	describe("GET /tasks/id/:id", () => {
		it("should return a task by ID", async () => {
			const response = await request(app)
				.get(`/tasks/id/${existingTaskId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);

			expect(response.body.task).toHaveProperty("id", existingTaskId);
		});

		it("should return 404 if task not found", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5"; // Use an ID that does not exist in the DB
			const response = await request(app)
				.get(`/tasks/id/${nonExistingId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe("No tasks matching the required ID");
		});
	});

	// Test GET /tasks/find (Find tasks by query)
	describe("GET /tasks/find", () => {
		it("should find tasks by query", async () => {
			const response = await request(app)
				.get("/tasks/find")
				.query({ name: "New Task" })
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);
			expect(response.body.task).toHaveProperty("name", "New Task");
		});
	});

	// Test GET /tasks/findmany (Find many tasks by query)
	describe("GET /tasks/findmany", () => {
		it("should return multiple tasks matching the query", async () => {
			const response = await request(app)
				.get("/tasks/findmany")
				.query({ status: "Pending" }) // Query to match task descriptions
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);

			expect(response.body.tasks.length).toBeGreaterThan(0); // Should return multiple tasks
		});
	});

	// Test PUT /tasks/update/:id (Update a task)
	describe("PUT /tasks/update/:id", () => {
		it("should update a task", async () => {
			const updatedTask = {
				name: "Updated Task",
				description: "Updated description",
			};

			const response = await request(app)
				.put(`/tasks/update/${existingTaskId}`)
				.send(updatedTask)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.CREATED);
		});

		it("should return 404 for non-existing task", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5";
			const response = await request(app)
				.put(`/tasks/update/${nonExistingId}`)
				.send({ name: "Non Existing Task" })
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe("No tasks matching the ID");
		});
	});

	// Test DELETE /tasks/delete/:id (Delete a task)
	describe("DELETE /tasks/delete/:id", () => {
		it("should delete a task", async () => {
			const response = await request(app)
				.delete(`/tasks/delete/${existingTaskId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);

			expect(response.body.message).toBe("Task deleted successfully");

			// Verify the task is deleted
			const task = await Task.findById(existingTaskId);
			expect(task).toBeNull();
		});

		it("should return 404 for non-existing task", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5";
			const response = await request(app)
				.delete(`/tasks/delete/${nonExistingId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe("No tasks matching the ID");
		});
	});
});
