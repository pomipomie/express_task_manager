import { Request, Response } from "express";
import { User } from "../../domain/entities/user.entity";
import IUserRepo from "../../domain/repositories/interfaces/iuser.repo";
import { compareHash } from "../../utils/auth/hash.utils";
import { bindMethods } from "../../utils/binder";
import { computeLimitAndOffset } from "../../utils/math";
import mongoose from "mongoose";
// import response messaages
// import error handlers
// import logger

export default class UserController {
	constructor(private repository: IUserRepo) {
		bindMethods(this); // Auto-bind methods
	}

	findAllUsers = async (req: Request, res: Response) => {
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
			const users = await this.repository.findAll(query);
			// const { page = 1, size = 50, ...query } = req.query;
			// console.log("q", page, size, query); //working
			// const count = await this.repository.count(query);
			// console.log("count", count);
			// const totalPages = Math.ceil(count / +size);

			// if (count === 0) {
			// 	return res.status(200).json({
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
			const responseUsers = users.map((user) =>
				this.generateUserResponse(user)
			);
			res.status(200).json({
				success: true,
				totalResults: users.length,
				results: responseUsers,
			});
		} catch (err) {
			// const errorMessage = getErrorMessage(err)
			// console.error(errorMessage)
			// logger.appendErrorLog(req.originalUrl, errorMessage)

			// return res.status(500).json({
			//   success: false,
			//   message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
			// })

			console.error(err);
			return res.status(500).json({
				success: false,
				message: "Error in user controller",
			});
		}
	};

	getUserById = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const user = await this.repository.findById(id);

			if (!user) {
				return res.status(404).json({
					success: false,
					// message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
					message: "User not found",
				});
			}

			res.status(200).json({
				success: true,
				user,
			});
		} catch (error) {
			//update later to add error messages and logging
			console.error(error);
			return res.status(500).json({
				success: false,
				message: "Error in user controller",
			});
		}
	};

	getUser = async (req: Request, res: Response) => {
		try {
			const query = req.query;
			const user = await this.repository.findOne(query, false);
			if (!user) {
				return res.status(404).json({
					success: false,
					// message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
					message: "User not found",
				});
			}

			res.status(200).json({
				success: true,
				user,
			});
		} catch (error) {
			//update later to add error messages and logging
			console.error(error);
			return res.status(500).json({
				success: false,
				message: "Error in user controller",
			});
		}
	};

	updateUser = async (req: Request, res: Response) => {
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
					return res.status(409).json({
						success: false,
						// message: ResponseMessages.RES_MSG_USER_EMAIL_ALREADY_EXISTS_EN,
						message: "Email already exists",
					});
				}
			}

			const updatedUser = await this.repository.updateOne({ ...updates, id });

			if (!updatedUser) {
				return res.status(404).json({
					success: false,
					// message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
					message: "User not found",
				});
			}

			res.status(201).json({
				success: true,
				// message: ResponseMessages.RES_MSG_USER_UPDATED_SUCCESSFULLY_EN,
				message: "User updated successfully",
				user: updatedUser,
			});
		} catch (error) {
			//update later to add error messages and logging
			console.error(error);
			return res.status(500).json({
				success: false,
				message: "Error in user controller",
			});
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		try {
			//TO IMPLEMENT DELETE BY QUERY
			// const { username, password } = req.body;
			// const user = await this.repository.findOne(username, true);

			// // check if user exists
			// if (!user) {
			// 	return res.status(404).json({
			// 		success: false,
			// 		// message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
			// 		message: "User not found",
			// 	});
			// }

			// // compare password hash
			// const match = await compareHash(password, user.auth.password!);

			// if (!match) {
			// 	return res.status(404).json({
			// 		success: false,
			// 		message: "ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN",
			// 	});
			// }

			// // TODO: check if requester user is same found user or has credentials
			// console.log("id", user.id);
			const deleted = await this.repository.deleteOne(req.params.id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					message: "ResponseMessages.RES_MSG_USER_NOT_FOUND_EN",
				});
			}

			res.status(200).json({
				success: true,
				message: "ResponseMessages.RES_MSG_USER_DELETED_SUCCESSFULLY_EN",
			});
		} catch (error) {
			//update later to add error messages and logging
			console.error(error);
			return res.status(500).json({
				success: false,
				message: "Error in user controller",
			});
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
