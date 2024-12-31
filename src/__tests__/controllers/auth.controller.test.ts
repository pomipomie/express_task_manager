import { Request, Response, NextFunction } from "express";
import AuthController from "../../api/controllers/auth.controller";
import AuthService from "../../api/services/auth.service";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { BaseError } from "../../utils/errors/baseError";
import { ClientError } from "../../utils/errors/clientError";
import UserRepo from "../../domain/repositories/user.repo";
import { JwtPayload } from "jsonwebtoken";
import IAuthService from "../../api/services/interfaces/iauth.service";

// Mock the AuthService
jest.mock("../../api/services/auth.service");
jest.mock("../../domain/repositories/user.repo"); // Mock the UserRepo

describe("AuthController", () => {
	let authController: AuthController;
	let mockAuthService: jest.Mocked<IAuthService>;
	let mockUserRepo: jest.Mocked<UserRepo>;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		mockUserRepo = new UserRepo() as jest.Mocked<UserRepo>; // Mocked UserRepo
		// Mock AuthService methods
		mockAuthService = {
			signup: jest.fn(),
			login: jest.fn(),
			verifyToken: jest.fn(),
			logout: jest.fn(),
		};

		// mockAuthService = new AuthService(
		// 	mockUserRepo,
		// 	"mockJwTSecret"
		// ) as jest.Mocked<AuthService>; // Mocked AuthService
		authController = new AuthController(new AuthService(mockUserRepo, "jwt"));

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

	describe("signup", () => {
		it("should successfully sign up a user", async () => {
			// Mock successful signup response
			mockAuthService.signup.mockResolvedValue({
				userId: "123",
				token: "fake-token",
			});

			const userData = { username: "john", password: "password" };
			req.body = userData; // Set signup data

			await authController.signup(req as Request, res as Response, next);

			expect(mockAuthService.signup).toHaveBeenCalledWith(userData);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
			expect(res.json).toHaveBeenCalledWith({
				message: "User registered successfully",
			});
		});

		it("should fail when signup fails", async () => {
			// Mock signup to throw an error
			mockAuthService.signup.mockRejectedValue(
				new Error("User registration failed")
			);

			req.body = { username: "john", password: "password" }; // Set signup data

			await authController.signup(req as Request, res as Response, next);

			// Expect next to be called with an error
			expect(next).toHaveBeenCalledWith(
				expect.objectContaining({
					message: "User registration failed", // Or your custom message
					statusCode: HttpStatusCode.INTERNAL_SERVER,
				})
			);
		});
	});

	describe("login", () => {
		it("should successfully log in a user", async () => {
			// Mock successful login response
			mockAuthService.login.mockResolvedValue({ token: "fake-token" });

			const userData = { username: "john", password: "password" };
			req.body = userData;

			await authController.login(req as Request, res as Response, next);

			expect(mockAuthService.login).toHaveBeenCalledWith(userData);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
			expect(res.json).toHaveBeenCalledWith({
				message: "User logged in successfully",
			});
		});

		it("should fail when login fails", async () => {
			// Mock login to throw an error
			mockAuthService.login.mockRejectedValue(
				new Error("User registration failed")
			);

			req.body = { username: "john", password: "wrongpassword" };

			await authController.login(req as Request, res as Response, next);

			expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
			expect(next).toHaveBeenCalledWith(
				expect.objectContaining({
					statusCode: HttpStatusCode.INTERNAL_SERVER,
					message: "User login failed",
				})
			);
		});
	});

	describe("verifyToken", () => {
		const decoded: JwtPayload = {
			id: "123",
			username: "john_doe",
		};

		it("should verify the token and attach user to the request", async () => {
			const decoded = { id: "123", username: "john" };
			// Mock verifyToken to return a decoded token
			mockAuthService.verifyToken.mockResolvedValue({ decoded });

			req.headers = { authorization: "Bearer fake-token" };

			await authController.verifyToken(req as Request, res as Response, next);

			expect(mockAuthService.verifyToken).toHaveBeenCalledWith("fake-token");
			expect((req as any).user).toEqual(decoded); // Ensure user is attached to req
			expect(next).toHaveBeenCalled();
		});

		it("should throw an error if token is invalid", async () => {
			// Mock verifyToken to throw an error
			mockAuthService.verifyToken.mockRejectedValue(new Error("Invalid token"));

			req.headers = { authorization: "Bearer invalid-token" };

			await authController.verifyToken(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(expect.any(Error)); // Expect the error to be passed to next()
		});
	});

	describe("logout", () => {
		it("should log out the user", async () => {
			// Implement logout behavior if it's decided to be implemented in the controller
			// For example, clearing the session or token handling
		});

		it("should handle errors during logout", async () => {
			// Simulate any errors that might occur during logout if necessary
		});
	});
});
