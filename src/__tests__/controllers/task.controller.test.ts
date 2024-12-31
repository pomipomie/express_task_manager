import { Request, Response, NextFunction } from "express";
import ITaskRepo from "../../domain/repositories/interfaces/itask.repo";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { ClientError } from "../../utils/errors/clientError";
import { deleteCache } from "../../data/cache/deleteCache";
import { saveCache } from "../../data/cache/saveCache";
import TaskController from "../../api/controllers/task.controller";
import { Task } from "../../domain/entities/task.entity";

// Mock the cache methods
jest.mock("../../data/cache/saveCache.ts", () => ({
	saveCache: jest.fn(),
}));
jest.mock("../../data/cache/deleteCache.ts", () => ({
	deleteCache: jest.fn(),
}));

describe("TaskController", () => {
	let MockTaskRepo: jest.Mocked<ITaskRepo>;
	let taskController: TaskController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		MockTaskRepo = {
			exists: jest.fn(),
			create: jest.fn(),
			count: jest.fn(),
			findAll: jest.fn(),
			findById: jest.fn(),
			findOne: jest.fn(),
			findMany: jest.fn(),
			findPaging: jest.fn(),
			deleteOne: jest.fn(),
			updateOne: jest.fn(),
			deleteMany: jest.fn(),
			updateMany: jest.fn(),
		};

		taskController = new TaskController(MockTaskRepo);

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
	it("should create a task successfully", async () => {
		req.body = { name: "Test Task" };

		MockTaskRepo.exists.mockResolvedValue(false);
		MockTaskRepo.create.mockResolvedValue({
			id: "1",
			name: "Test Task",
		} as Task);

		await taskController.createTask(req as Request, res as Response, next);

		expect(MockTaskRepo.exists).toHaveBeenCalledWith("Test Task");
		expect(MockTaskRepo.create).toHaveBeenCalledWith(req.body);
		expect(deleteCache).toHaveBeenCalledWith("/tasks");
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
		expect(res.json).toHaveBeenCalledWith({
			message: "Task created successfully",
		});
	});

	it("should throw conflict error when creating a duplicate task", async () => {
		req.body = { name: "Duplicate Task" };

		MockTaskRepo.exists.mockResolvedValue(true);

		await taskController.createTask(req as Request, res as Response, next);

		expect(MockTaskRepo.exists).toHaveBeenCalledWith("Duplicate Task");
		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});

	it("should retrieve all tasks successfully", async () => {
		const tasks = [{ id: "1", name: "Task 1" }];
		MockTaskRepo.findAll.mockResolvedValue(tasks as Task[]);

		await taskController.getAllTasks(req as Request, res as Response, next);

		expect(MockTaskRepo.findAll).toHaveBeenCalledWith(req.query);
		expect(saveCache).toHaveBeenCalledWith(req, tasks);
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			totalResults: tasks.length,
			results: tasks,
		});
	});

	it("should handle invalid ObjectId in getAllTasks", async () => {
		req.query = { _id: "invalidId" };

		await taskController.getAllTasks(req as Request, res as Response, next);

		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});

	it("should retrieve all tasks matching the given query successfully", async () => {
		const tasks = [{ id: "1", name: "Task 1", status: "Pending" }];
		req.query = { status: "Pending" };
		MockTaskRepo.findAll.mockResolvedValue(tasks as Task[]);

		await taskController.getAllTasks(req as Request, res as Response, next);

		expect(MockTaskRepo.findAll).toHaveBeenCalledWith(req.query);
		expect(saveCache).toHaveBeenCalledWith(req, tasks);
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			totalResults: tasks.length,
			results: tasks,
		});
	});

	it("should delete a task successfully", async () => {
		req.params = { id: "1" };
		MockTaskRepo.deleteOne.mockResolvedValue(true);

		await taskController.deleteTask(req as Request, res as Response, next);

		expect(MockTaskRepo.deleteOne).toHaveBeenCalledWith("1");
		expect(deleteCache).toHaveBeenCalledWith("/tasks");
		expect(deleteCache).toHaveBeenCalledWith("/tasks/id/1");
		expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Task deleted successfully",
		});
	});

	it("should handle task not found in deleteTask", async () => {
		req.params = { id: "1" };
		MockTaskRepo.deleteOne.mockResolvedValue(false);

		await taskController.deleteTask(req as Request, res as Response, next);

		expect(next).toHaveBeenCalledWith(
			expect.any(ClientError) // Verify next is called with a ClientError
		);
	});
});
