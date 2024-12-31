import { Request, Response, NextFunction } from "express";
import IProjectRepo from "../../domain/repositories/interfaces/iproject.repo";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { ClientError } from "../../utils/errors/clientError";
import { deleteCache } from "../../data/cache/deleteCache";
import { saveCache } from "../../data/cache/saveCache";
import ProjectController from "../../api/controllers/project.controller";
import { Project } from "../../domain/entities/project.entity";

// Mock the cache methods
jest.mock("../../data/cache/saveCache.ts", () => ({
	saveCache: jest.fn(),
}));
jest.mock("../../data/cache/deleteCache.ts", () => ({
	deleteCache: jest.fn(),
}));

describe("ProjectController", () => {
	let MockProjectRepo: jest.Mocked<IProjectRepo>;
	let projectController: ProjectController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		MockProjectRepo = {
			exists: jest.fn(),
			create: jest.fn(),
			count: jest.fn(),
			findAll: jest.fn(),
			findById: jest.fn(),
			findOne: jest.fn(),
			findPaging: jest.fn(),
			deleteOne: jest.fn(),
			updateOne: jest.fn(),
			deleteMany: jest.fn(),
			updateMany: jest.fn(),
		};

		projectController = new ProjectController(MockProjectRepo);

		req = { body: {}, params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Test cases
	it("should create a project successfully", async () => {
		req.body = { name: "Test Project" };

		MockProjectRepo.exists.mockResolvedValue(false);
		MockProjectRepo.create.mockResolvedValue({
			id: "1",
			name: "Test Project",
		} as Project);

		await projectController.createProject(
			req as Request,
			res as Response,
			next
		);

		expect(MockProjectRepo.exists).toHaveBeenCalledWith("Test Project");
		expect(MockProjectRepo.create).toHaveBeenCalledWith(req.body);
		expect(deleteCache).toHaveBeenCalledWith("/projects");
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
		expect(res.json).toHaveBeenCalledWith({
			message: "Project created successfully",
		});
	});

	it("should throw conflict error when creating a duplicate project", async () => {
		req.body = { name: "Duplicate Project" };

		MockProjectRepo.exists.mockResolvedValue(true);

		await projectController.createProject(
			req as Request,
			res as Response,
			next
		);

		expect(MockProjectRepo.exists).toHaveBeenCalledWith("Duplicate Project");
		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});

	it("should retrieve all projects successfully", async () => {
		const projects = [{ id: "1", name: "Project 1" }];
		MockProjectRepo.findAll.mockResolvedValue(projects as Project[]);

		await projectController.getAllProjects(
			req as Request,
			res as Response,
			next
		);

		expect(MockProjectRepo.findAll).toHaveBeenCalledWith(req.query);
		expect(saveCache).toHaveBeenCalledWith(req, projects);
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			totalResults: projects.length,
			results: projects,
		});
	});

	it("should handle invalid ObjectId in getAllProjects", async () => {
		req.query = { _id: "invalidId" };

		await projectController.getAllProjects(
			req as Request,
			res as Response,
			next
		);

		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});

	it("should delete a project successfully", async () => {
		req.params = { id: "1" };
		MockProjectRepo.deleteOne.mockResolvedValue(true);

		await projectController.deleteProject(
			req as Request,
			res as Response,
			next
		);

		expect(MockProjectRepo.deleteOne).toHaveBeenCalledWith("1");
		expect(deleteCache).toHaveBeenCalledWith("/projects");
		expect(deleteCache).toHaveBeenCalledWith("/projects/id/1");
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Project deleted successfully",
		});
	});

	it("should handle project not found in deleteProject", async () => {
		req.params = { id: "1" };
		MockProjectRepo.deleteOne.mockResolvedValue(false);

		await projectController.deleteProject(
			req as Request,
			res as Response,
			next
		);

		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});
});
