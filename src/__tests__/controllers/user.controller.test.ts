import { Request, Response, NextFunction } from "express";
import { User } from "../../domain/entities/user.entity";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { BaseError } from "../../utils/errors/baseError";
import UserController from "../../api/controllers/user.controller";
import UserRepo from "../../domain/repositories/user.repo";
import { roles } from "../../utils/enums/roles.enum";
import { deleteCache } from "../../data/cache/deleteCache";
import { saveCache } from "../../data/cache/saveCache";

jest.mock("../../domain/repositories/user.repo"); // Mock the UserRepo
jest.mock("../../data/models/user.model"); // Mock the User model if necessary

// Mock the cache methods
jest.mock("../../data/cache/saveCache.ts", () => ({
	saveCache: jest.fn(),
}));
jest.mock("../../data/cache/deleteCache.ts", () => ({
	deleteCache: jest.fn(),
}));

describe("UserController", () => {
	let userController: UserController;
	let mockUserRepo: jest.Mocked<UserRepo>;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		mockUserRepo = new UserRepo() as jest.Mocked<UserRepo>; // Mocked UserRepo
		userController = new UserController(mockUserRepo);

		req = {}; // Empty req, will be populated in each test
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks(); // Clear mocks to avoid interference between tests
	});

	// describe('createUser', () => {
	//   it('should create a new user successfully', async () => {
	//     const userData = { username: 'JohnDoe', email: 'john@example.com' };
	//     const newUser = { ...userData, id: '1' };

	//     mockUserRepo.create.mockResolvedValue(newUser as User); // Mock create method

	//     req.body = userData;

	//     await userController.createUser(req as Request, res as Response, next);

	//     expect(mockUserRepo.create).toHaveBeenCalledWith(userData);
	//     expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
	//     expect(res.json).toHaveBeenCalledWith({
	//       message: 'User created successfully',
	//       user: newUser,
	//     });
	//   });

	//   it('should throw an error if user creation fails', async () => {
	//     const userData = { username: 'JohnDoe', email: 'john@example.com' };
	//     mockUserRepo.create.mockRejectedValue(new Error('User creation failed'));

	//     req.body = userData;

	//     await userController.createUser(req as Request, res as Response, next);

	//     expect(next).toHaveBeenCalledWith(expect.any(BaseError)); // Check that error is passed to the next middleware
	//   });
	// });

	describe("getUserById", () => {
		it("should retrieve user by ID", async () => {
			const userId = "677307698b1420ba9a8a5245";
			const user = {
				id: userId,
				username: "JohnDoe",
				email: "john@example.com",
				firstName: "John",
				lastName: "Doe",
				auth: {
					token: "",
					password: "",
					role: roles.USER,
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockUserRepo.findById.mockResolvedValue(user); // Mock findById method

			req.params = { id: userId };

			await userController.getUserById(req as Request, res as Response, next);

			expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
			// expect(deleteCache).toHaveBeenCalledWith("/users");
			// expect(deleteCache).toHaveBeenCalledWith(`/users/id/${userId}`);
			// expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
			// expect(res.json).toHaveBeenCalledWith({
			// 	success: true,
			// 	user,
			// });
		});

		it("should return 404 if user not found", async () => {
			const userId = "1";
			mockUserRepo.findById.mockResolvedValue(null); // No user found

			req.params = { id: userId };

			await userController.getUserById(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(expect.any(BaseError)); // Should pass a 'not found' error
		});
	});

	describe("updateUser", () => {
		it("should update user information successfully", async () => {
			const userId = "677307698b1420ba9a8a5245";
			const updatedData = {
				username: "JohnUpdated",
				email: "johnupdated@example.com",
			};
			const updatedUser = { id: userId, ...updatedData };

			mockUserRepo.updateOne.mockResolvedValue(updatedUser as User); // Mock updateOne method

			req.params = { id: userId };
			req.body = updatedData;

			await userController.updateUser(req as Request, res as Response, next);

			expect(mockUserRepo.updateOne).toHaveBeenCalledWith({
				...updatedData,
				id: userId,
			});
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "User updated successfully",
				user: updatedUser,
			});
		});

		it("should return error if update fails", async () => {
			const userId = "677307698b1420ba9a8a5245";
			const updatedData = {
				username: "JohnUpdated",
				email: "johnupdated@example.com",
			};
			mockUserRepo.updateOne.mockResolvedValue(null); // No user updated

			req.params = { id: userId };
			req.body = updatedData;

			await userController.updateUser(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(expect.any(BaseError)); // Should pass an error if update fails
		});
	});

	describe("deleteUser", () => {
		it("should delete a user successfully", async () => {
			const userId = "1";
			mockUserRepo.deleteOne.mockResolvedValue(true); // Mock deleteOne method

			req.params = { id: userId };

			await userController.deleteUser(req as Request, res as Response, next);

			expect(mockUserRepo.deleteOne).toHaveBeenCalledWith(userId);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "User deleted successfully",
			});
		});

		it("should return error if user not found for deletion", async () => {
			const userId = "1";
			mockUserRepo.deleteOne.mockResolvedValue(false); // No user deleted

			req.params = { id: userId };

			await userController.deleteUser(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(expect.any(BaseError)); // Should pass an error if no user is deleted
		});
	});
});
