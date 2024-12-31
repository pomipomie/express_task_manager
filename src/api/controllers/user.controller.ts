import { NextFunction, Request, Response } from "express";
import { User } from "../../domain/entities/user.entity";
import IUserRepo from "../../domain/repositories/interfaces/iuser.repo";
import { bindMethods } from "../../utils/binder";
// import { computeLimitAndOffset } from "../../utils/math";
import mongoose from "mongoose";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

export default class UserController {
	constructor(private repository: IUserRepo) {
		bindMethods(this); // Auto-bind methods
	}

	findAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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
			res.status(HttpStatusCode.OK).json({
				success: true,
				totalResults: users.length,
				results: responseUsers,
			});
		} catch (err) {
			next(err);
		}
	};

	//TODO: find users with pagination
	// const { page = 1, size = 50, ...query } = req.query;
	// console.log("q", page, size, query); //working
	// const count = await this.repository.count(query);
	// console.log("count", count);
	// const totalPages = Math.ceil(count / +size);

	// if (count === 0) {
	// 	return res.status(HttpStatusCode.OK).json({
	// 		success: true,
	// 		totalPages: 0,
	// 		page: 0,
	// 		pageResults: 0,
	// 		totalResults: 0,
	// 		results: [],
	// 	});
	// }

	// if (Number(page) > totalPages) {
	// 	return res.status(400).json({
	// 		success: false,
	// 		message: "ResponseMessages.RES_MSG_PAGE_OUT_OF_BOUNDS_EN",
	// 	});
	// }

	// const { limit, offset } = computeLimitAndOffset(+page, +size);

	// const users = await this.repository.findPaging(query, offset, limit);

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
