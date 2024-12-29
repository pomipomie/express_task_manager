import { Request, Response } from "express";
import { User } from "../../domain/entities/user.entity";
import IUserRepo from "../../domain/repositories/user.repo";
// import response messaages
// import error handlers
// import logger

export default class UserController {
	constructor(private repository: IUserRepo) {}

	findAllUsers = async (req: Request, res: Response) => {
		try {
			const query = req.query;
			const users = await this.repository.findAll(query);
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
			const { username, password } = req.body;
			const user = await this.repository.findOne(username, true);

			// check if user exists
			if (!user) {
				return res.status(404).json({
					success: false,
					// message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
					message: "User not found",
				});
			}

			// compare password hash
			// const match = await utils.compareHash(password, user.password!)

			// if (!match) {
			//   return res.status(404).json({
			//     success: false,
			//     message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
			//   })
			// }

			// check if requester user is same found user or has credentials

			const deleted = await this.repository.deleteOne({ id: user.id });

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
