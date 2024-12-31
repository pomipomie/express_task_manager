import mongoose from "mongoose";
import { TCreateParams } from "../../domain/dto/task.dto";
import ITaskRepo from "../../domain/repositories/interfaces/itask.repo";
import { bindMethods } from "../../utils/binder";
import { NextFunction, Request, Response } from "express";

export default class TaskController {
	constructor(private taskRepo: ITaskRepo) {
		bindMethods(this); // Auto-bind methods
	}

	createTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const taskData: TCreateParams = req.body;
			const create = await this.taskRepo.create(taskData);
			if (create) {
				return res.status(201).json({ message: "Task created successfully" });
			} else {
				throw new Error("Error creating task");
			}
		} catch (error) {
			console.error(error);
		}
	};

	getAllTasks = async (req: Request, res: Response) => {
		try {
			const query = req.query;
			console.log(query, query._id);
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
				return res.status(400).json({
					success: false,
					message: "Invalid ObjectId",
				});
			}
			const tasks = await this.taskRepo.findAll(query);
			res.status(200).json({
				success: true,
				totalResults: tasks.length,
				results: tasks,
			});
		} catch (error) {
			console.error(error);
		}
	};

	getTaskById = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const task = await this.taskRepo.findById(id);

			if (!task) {
				return res.status(404).json({
					success: false,
					message: "Task not found",
				});
			}

			res.status(200).json({
				success: true,
				task,
			});
		} catch (error) {
			console.error(error);
		}
	};

	findTask = async (req: Request, res: Response) => {
		try {
			const query = req.query;
			const task = await this.taskRepo.findOne(query);
			if (!task) {
				return res.status(404).json({
					success: false,
					message: "task not found",
				});
			}

			res.status(200).json({
				success: true,
				task,
			});
		} catch (error) {
			console.error(error);
		}
	};

	deleteTask = async (req: Request, res: Response) => {
		try {
			const deleted = await this.taskRepo.deleteOne(req.params.id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "Task not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Task deleted successfully",
			});
		} catch (error) {
			console.error(error);
		}
	};

	updateTask = async (req: Request, res: Response) => {
		try {
			const updates = req.body;
			const id = req.params.id;

			// check if updated task name exists
			if (updates.name) {
				const exists = await this.taskRepo.exists(updates.name, id);

				if (exists) {
					return res.status(409).json({
						success: false,
						message: "Task of the same name already exists",
					});
				}
			}

			const updatedTask = await this.taskRepo.updateOne({ ...updates, id });

			if (!updatedTask) {
				return res.status(404).json({
					success: false,
					message: "Task not found",
				});
			}

			res.status(201).json({
				success: true,
				message: "Task updated successfully",
				user: updatedTask,
			});
		} catch (error) {
			console.error(error);
		}
	};
}
