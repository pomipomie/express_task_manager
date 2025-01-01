import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import Project from "../../data/models/project.model";

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

describe("Project Routes Integration Tests", () => {
	let existingProjectId: string = "67754cf924dcce89f0808b85"; // Change to match actual IDs

	// Test middleware
	describe("GET /projects", () => {
		it("should allow access with valid token", async () => {
			const response = await request(app)
				.get("/projects") // Replace with your route
				.set("Authorization", "Bearer valid_token"); // Valid token

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});
	});

	describe("GET /projects", () => {
		it("should deny access without token", async () => {
			const response = await request(app).get("/projects"); // No token

			expect(response.status).toBe(401);
		});

		it("should deny access with invalid token", async () => {
			const response = await request(app)
				.get("/projects")
				.set("Authorization", "Bearer invalidtoken"); // Invalid token

			expect(response.status).toBe(401);
		});
	});

	// Test POST /projects/new (Create a new project)
	describe("POST /projects/new", () => {
		it("should create a new project", async () => {
			const newProject = {
				name: `New project ${Math.random() * 100}`,
				description: "This is a test project",
				users: [],
				status: "Pending",
				dueDate: "2024-12-31",
			};

			const response = await request(app)
				.post("/projects/new")
				.set("Authorization", "Bearer valid_token") // Valid token
				.send(newProject)
				.expect(HttpStatusCode.CREATED || HttpStatusCode.CONFLICT);

			expect(response.body.message).toBe("Project created successfully");
		});
	});

	// Test GET /projects/ (Retrieve all projects)
	describe("GET /projects/", () => {
		it("should return a list of projects", async () => {
			const response = await request(app)
				.get("/projects/")
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);
			expect(response.body).toHaveProperty("results");
			expect(response.body.results).toBeInstanceOf(Object);
			expect(response.body.results.length).toBeGreaterThan(0); // Assuming there is at least one project in the database
		});
	});

	// Test GET /projects/id/:id (Retrieve a project by ID)
	describe("GET /projects/id/:id", () => {
		it("should return a project by ID", async () => {
			const response = await request(app)
				.get(`/projects/id/${existingProjectId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);

			expect(response.body.project).toHaveProperty("id", existingProjectId);
		});

		it("should return 404 if project not found", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5"; // Use an ID that does not exist in the DB
			const response = await request(app)
				.get(`/projects/id/${nonExistingId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe(
				"No projects matching the required ID"
			);
		});
	});

	// Test GET /projects/find (Find projects by query)
	describe("GET /projects/find", () => {
		it("should find projects by query", async () => {
			const response = await request(app)
				.get("/projects/find")
				.query({ description: "This is a test project" })
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);
			expect(response.body.project).toHaveProperty(
				"description",
				"This is a test project"
			);
		});
	});

	// Test PUT /projects/update/:id (Update a project)
	describe("PUT /projects/update/:id", () => {
		it("should update a project", async () => {
			const updatedProject = {
				name: "Updated Project",
				description: "Updated description",
			};

			const response = await request(app)
				.put(`/projects/update/${existingProjectId}`)
				.send(updatedProject)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.CREATED);
		});

		it("should return 404 for non-existing project", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5";
			const response = await request(app)
				.put(`/projects/update/${nonExistingId}`)
				.send({ name: "Non Existing Project" })
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe(
				"No projects matching the required ID"
			);
		});
	});

	// Test DELETE /projects/delete/:id (Delete a project)
	describe("DELETE /projects/delete/:id", () => {
		it("should delete a project", async () => {
			const response = await request(app)
				.delete(`/projects/delete/${existingProjectId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.OK);

			expect(response.body.message).toBe("Project deleted successfully");

			// Verify the project is deleted
			const project = await Project.findById(existingProjectId);
			expect(project).toBeNull();
		});

		it("should return 404 for non-existing project", async () => {
			const nonExistingId = "60e4d0f4f1f2b6c7258d33f5";
			const response = await request(app)
				.delete(`/projects/delete/${nonExistingId}`)
				.set("Authorization", "Bearer valid_token") // Valid token
				.expect(HttpStatusCode.NOT_FOUND);

			expect(response.body.message).toBe(
				"No projects matching the required ID"
			);
		});
	});
});
