import { NextFunction, Request, Response } from "express";
import { User } from "../../domain/entities/user.entity";
import IUserRepo from "../../domain/repositories/interfaces/iuser.repo";
import { bindMethods } from "../../utils/binder";
// import { computeLimitAndOffset } from "../../utils/math";
import mongoose from "mongoose";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { saveCache } from "../../data/cache/saveCache";
import { deleteCache } from "../../data/cache/deleteCache";

export default class UserController {
	constructor(private repository: IUserRepo) {
		bindMethods(this); // Auto-bind methods
	}

	findAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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
			const users = await this.repository.findAll(query);

			const responseUsers = users.map((user) =>
				this.generateUserResponse(user)
			);

			// Save data to Redis cache for future requests
			await saveCache(req, responseUsers);

			res.status(HttpStatusCode.OK).json({
				success: true,
				totalResults: users.length,
				results: responseUsers,
			});
		} catch (err) {
			next(err);
		}
	};

	findUsersPaginated = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { page = "1", limit = "10", sort = "createdAt", order = "desc", ...query } = req.query;

			// Convert to numbers and validate
			const pageNumber = Math.max(parseInt(page as string, 10), 1);
			const limitNumber = Math.max(parseInt(limit as string, 10), 1);
			const offset = (pageNumber - 1) * limitNumber;

			// Sort object
			const sortOrder = order === "asc" ? 1 : -1;
			const sortObj = { [sort as string]: sortOrder };

			// validate ObjectId if query includes _id
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

			const [users, total] = await Promise.all([
				this.repository.findPaging(query, offset, limitNumber, sortObj),
				this.repository.count(query),
			]);

			const responseUsers = users.map((user) => this.generateUserResponse(user));

			// Save data to Redis cache for future requests
			await saveCache(req, responseUsers);

			res.status(HttpStatusCode.OK).json({
				success: true,
				page: pageNumber,
				limit: limitNumber,
				totalResults: total,
				totalPages: Math.ceil(total / limitNumber),
				results: responseUsers,
			});
		} catch (err) {
			next(err);
		}
	};

	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = req.params.id;
			const user = await this.repository.findById(id);

			if (!user) {
				throw new ClientError(
					"User not found",
					HttpStatusCode.NOT_FOUND,
					"No users matching the provided ID"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, user);

			res.status(HttpStatusCode.OK).json({
				success: true,
				user,
			});
		} catch (error) {
			next(error);
		}
	};

	getUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const query = req.query;
			const user = await this.repository.findOne(query, false);
			if (!user) {
				throw new ClientError(
					"User not found",
					HttpStatusCode.NOT_FOUND,
					"No users matching the provided ID"
				);
			}

			// Save data to Redis cache for future requests
			await saveCache(req, user);

			res.status(HttpStatusCode.OK).json({
				success: true,
				user,
			});
		} catch (error) {
			next(error);
		}
	};

	updateUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const updates = req.body;
			const id = req.params.id;

			// check if updated email exists
			if (updates.email) {
				const exists = await this.repository.exists(
					updates.email,
					undefined,
					id
				);

				if (exists) {
					throw new ClientError(
						"Email already exists",
						HttpStatusCode.CONFLICT,
						"Please try a different email address"
					);
				}
			}

			const updatedUser = await this.repository.updateOne({ ...updates, id });

			if (!updatedUser) {
				throw new ClientError(
					"User not found",
					HttpStatusCode.NOT_FOUND,
					"No users matching the provided ID"
				);
			}

			//clear cache for list of all users
			await deleteCache("/users");

			//clear cache for this user
			await deleteCache(`/users/id/${id}`);

			res.status(HttpStatusCode.CREATED).json({
				success: true,
				message: "User updated successfully",
				user: updatedUser,
			});
		} catch (error) {
			next(error);
		}
	};

	deleteUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// // TODO: check if requester user is same found user or has credentials

			const deleted = await this.repository.deleteOne(req.params.id);

			if (!deleted) {
				throw new ClientError(
					"User not found",
					HttpStatusCode.NOT_FOUND,
					"No users matching the provided ID"
				);
			}

			//clear cache for list of all users
			await deleteCache("/users");

			//clear cache for this user
			await deleteCache(`/users/id/${req.params.id}`);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "User deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	// helper functions
	private generateUserResponse = (user: User) => {
		return {
			...user,
			auth: undefined,
		};
	};
}
