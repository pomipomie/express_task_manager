import mongoose from "mongoose";
import { PCreateParams } from "../../domain/dto/project.dto";
import IProjectRepo from "../../domain/repositories/interfaces/iproject.repo";
import { NextFunction, Request, Response } from "express";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { BaseError } from "../../utils/errors/baseError";
import { saveCache } from "../../data/cache/saveCache";
import { deleteCache } from "../../data/cache/deleteCache";

export default class ProjectController {
	constructor(private projectRepo: IProjectRepo) {}

	createProject = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const projectData: PCreateParams = req.body;
			const exists = await this.projectRepo.exists(projectData.name);
			if (exists) {
				throw new ClientError(
					"Duplicate project",
					HttpStatusCode.CONFLICT,
					"Project of the same name already exists"
				);
			}
			const create = await this.projectRepo.create(projectData);
			if (create) {
				//clear cache for list of all projects
				await deleteCache("/projects");

				return res
					.status(HttpStatusCode.CREATED)
					.json({ message: "Project created successfully" });
			} else {
				throw new BaseError(
					"Error creating project",
					HttpStatusCode.INTERNAL_SERVER,
					"Project creation failed",
					true
				);
			}
		} catch (error) {
			next(error);
		}
	};

	getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
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
					"Error getting projects IDs",
					HttpStatusCode.BAD_REQUEST,
					"Invalid ObjectId"
				);
			}
			const projects = await this.projectRepo.findAll(query);

			// Save data to Redis cache for future requests
			await saveCache(req, projects);

			res.status(HttpStatusCode.OK).json({
				success: true,
				totalResults: projects.length,
				results: projects,
			});
		} catch (error) {
			next(error);
		}
	};

	getProjectById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = req.params.id;
			const project = await this.projectRepo.findById(id);

			if (!project) {
				throw new ClientError(
					"Project not found",
					HttpStatusCode.NOT_FOUND,
					"No projects matching the required ID"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, project);

			res.status(HttpStatusCode.OK).json({
				success: true,
				project,
			});
		} catch (error) {
			next(error);
		}
	};

	findProject = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const query = req.query;
			const project = await this.projectRepo.findOne(query);
			if (!project) {
				throw new ClientError(
					"Project not found",
					HttpStatusCode.NOT_FOUND,
					"No projects matching the provided query"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, project);

			res.status(HttpStatusCode.OK).json({
				success: true,
				project,
			});
		} catch (error) {
			next(error);
		}
	};

	deleteProject = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const deleted = await this.projectRepo.deleteOne(req.params.id);

			if (!deleted) {
				throw new ClientError(
					"Project not found",
					HttpStatusCode.NOT_FOUND,
					"No projects matching the required ID"
				);
			}

			//clear cache for list of all projects
			await deleteCache("/projects");

			//clear cache for this user
			await deleteCache(`/projects/id/${req.params.id}`);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Project deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	updateProject = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const updates = req.body;
			const id = req.params.id;

			// check if updated project name exists
			if (updates.name) {
				const exists = await this.projectRepo.exists(updates.name, id);

				if (exists) {
					throw new ClientError(
						"Duplicate project",
						HttpStatusCode.CONFLICT,
						"Project of the same name already exists"
					);
				}
			}

			const updatedProject = await this.projectRepo.updateOne({
				...updates,
				id,
			});

			if (!updatedProject) {
				throw new ClientError(
					"Project not found",
					HttpStatusCode.NOT_FOUND,
					"No projects matching the required ID"
				);
			}

			//clear cache for list of all projects
			await deleteCache("/projects");

			//clear cache for this user
			await deleteCache(`/projects/id/${id}`);

			res.status(HttpStatusCode.CREATED).json({
				success: true,
				message: "Project updated successfully",
				user: updatedProject,
			});
		} catch (error) {
			next(error);
		}
	};
}
