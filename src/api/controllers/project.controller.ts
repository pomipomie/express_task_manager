import mongoose from "mongoose";
import { PCreateParams } from "../../domain/dto/project.dto";
import IProjectRepo from "../../domain/repositories/interfaces/iproject.repo";
import { Request, Response } from "express";

export default class ProjectController {
	constructor(private projectRepo: IProjectRepo) {}

	createProject = async (req: Request, res: Response) => {
		try {
			const projectData: PCreateParams = req.body;
			const create = await this.projectRepo.create(projectData);
			if (create) {
				return res
					.status(201)
					.json({ message: "Project created successfully" });
			} else {
				throw new Error("Error creating project");
			}
		} catch (error) {
			console.error(error);
		}
	};

	getAllProjects = async (req: Request, res: Response) => {
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
			const projects = await this.projectRepo.findAll(query);
			res.status(200).json({
				success: true,
				totalResults: projects.length,
				results: projects,
			});
		} catch (error) {
			console.error(error);
		}
	};

	getProjectById = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const project = await this.projectRepo.findById(id);

			if (!project) {
				return res.status(404).json({
					success: false,
					message: "Project not found",
				});
			}

			res.status(200).json({
				success: true,
				project,
			});
		} catch (error) {
			console.error(error);
		}
	};

	findProject = async (req: Request, res: Response) => {
		try {
			const query = req.query;
			const project = await this.projectRepo.findOne(query);
			if (!project) {
				return res.status(404).json({
					success: false,
					message: "project not found",
				});
			}

			res.status(200).json({
				success: true,
				project,
			});
		} catch (error) {
			console.error(error);
		}
	};

	deleteProject = async (req: Request, res: Response) => {
		try {
			const deleted = await this.projectRepo.deleteOne(req.params.id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "Project not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Project deleted successfully",
			});
		} catch (error) {
			console.error(error);
		}
	};

	updateProject = async (req: Request, res: Response) => {
		try {
			const updates = req.body;
			const id = req.params.id;

			// check if updated project name exists
			if (updates.name) {
				const exists = await this.projectRepo.exists(updates.name, id);

				if (exists) {
					return res.status(409).json({
						success: false,
						message: "Project of the same name already exists",
					});
				}
			}

			const updatedProject = await this.projectRepo.updateOne({
				...updates,
				id,
			});

			if (!updatedProject) {
				return res.status(404).json({
					success: false,
					message: "Project not found",
				});
			}

			res.status(201).json({
				success: true,
				message: "Project updated successfully",
				user: updatedProject,
			});
		} catch (error) {
			console.error(error);
		}
	};
}
