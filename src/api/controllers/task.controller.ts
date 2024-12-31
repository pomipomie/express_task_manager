import mongoose from "mongoose";
import { TCreateParams } from "../../domain/dto/task.dto";
import ITaskRepo from "../../domain/repositories/interfaces/itask.repo";
import { bindMethods } from "../../utils/binder";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { BaseError } from "../../utils/errors/baseError";
import { ClientError } from "../../utils/errors/clientError";
import { saveCache } from "../../data/cache/saveCache";
import { deleteCache } from "../../data/cache/deleteCache";

export default class TaskController {
	constructor(private taskRepo: ITaskRepo) {
		bindMethods(this); // Auto-bind methods
	}

	createTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const taskData: TCreateParams = req.body;
			const exists = await this.taskRepo.exists(taskData.name);
			if (exists) {
				throw new ClientError(
					"Duplicate task",
					HttpStatusCode.CONFLICT,
					"Task of the same name already exists"
				);
			}
			const create = await this.taskRepo.create(taskData);
			if (create) {
				//clear cache for list of all tasks
				await deleteCache("/tasks");

				return res
					.status(HttpStatusCode.CREATED)
					.json({ message: "Task created successfully" });
			} else {
				throw new BaseError(
					"Error creating task",
					HttpStatusCode.INTERNAL_SERVER,
					"Task creation failed",
					true
				);
			}
		} catch (error) {
			next(error);
		}
	};

	getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const query = req.query;
			if (
				query._id &&
				!mongoose.Types.ObjectId.isValid(
					query._id as
						| string
						| number
						| mongoose.mongo.BSON.ObjectId
						| mongoose.mongo.BSON.ObjectIdLike
						| Uint8Array
				)
			) {
				throw new ClientError(
					"Error getting tasks IDs",
					HttpStatusCode.BAD_REQUEST,
					"Invalid ObjectId"
				);
			}
			const tasks = await this.taskRepo.findAll(query);

			// Save data to Redis cache for future requests
			await saveCache(req, tasks);

			res.status(HttpStatusCode.OK).json({
				success: true,
				totalResults: tasks.length,
				results: tasks,
			});
		} catch (error) {
			next(error);
		}
	};

	getTaskById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = req.params.id;
			const task = await this.taskRepo.findById(id);

			if (!task) {
				throw new ClientError(
					"Task not found",
					HttpStatusCode.NOT_FOUND,
					"No tasks matching the required ID"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, task);

			res.status(HttpStatusCode.OK).json({
				success: true,
				task,
			});
		} catch (error) {
			next(error);
		}
	};

	findTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const query = req.query;
			if (
				query._id &&
				!mongoose.Types.ObjectId.isValid(
					query._id as
						| string
						| number
						| mongoose.mongo.BSON.ObjectId
						| mongoose.mongo.BSON.ObjectIdLike
						| Uint8Array
				)
			) {
				throw new ClientError(
					"Error getting tasks IDs",
					HttpStatusCode.BAD_REQUEST,
					"Invalid ObjectId"
				);
			}
			const task = await this.taskRepo.findOne(query);
			if (!task) {
				throw new ClientError(
					"Task not found",
					HttpStatusCode.NOT_FOUND,
					"No tasks matching the query"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, task);

			res.status(HttpStatusCode.OK).json({
				success: true,
				task,
			});
		} catch (error) {
			next(error);
		}
	};

	findManyTasks = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const query = req.query;
			const tasks = await this.taskRepo.findAll(query);

			if (tasks.length === 0) {
				throw new ClientError(
					"No tasks found",
					HttpStatusCode.NOT_FOUND,
					"No tasks matching the query"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, tasks);

			res.status(HttpStatusCode.OK).json({
				success: true,
				tasks,
			});
		} catch (error) {
			next(error);
		}
	};

	deleteTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const deleted = await this.taskRepo.deleteOne(req.params.id);

			if (!deleted) {
				throw new ClientError(
					"Task not found",
					HttpStatusCode.NOT_FOUND,
					"No tasks matching the ID"
				);
			}

			//clear cache for list of all tasks
			await deleteCache("/tasks");

			//clear cache for this task
			await deleteCache(`/tasks/id/${req.params.id}`);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Task deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	updateTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const updates = req.body;
			const id = req.params.id;

			// check if updated task name exists
			if (updates.name) {
				const exists = await this.taskRepo.exists(updates.name, id);

				if (exists) {
					throw new ClientError(
						"Duplicate task",
						HttpStatusCode.CONFLICT,
						"Task of the same name already exists"
					);
				}
			}

			const updatedTask = await this.taskRepo.updateOne({ ...updates, id });

			if (!updatedTask) {
				throw new ClientError(
					"Task not found",
					HttpStatusCode.NOT_FOUND,
					"No tasks matching the ID"
				);
			}

			//clear cache for list of all tasks
			await deleteCache("/tasks");

			//clear cache for this task
			await deleteCache(`/tasks/id/${id}`);

			res.status(HttpStatusCode.CREATED).json({
				success: true,
				message: "Task updated successfully",
				user: updatedTask,
			});
		} catch (error) {
			next(error);
		}
	};
}
