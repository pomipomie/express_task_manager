import { Request, Response, NextFunction } from "express";
import AuthController from "../../api/controllers/auth.controller";
import AuthService from "../../api/services/auth.service";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { createClient } from "redis";

jest.mock("../../domain/repositories/user.repo"); // optional if you mock manually
jest.mock("redis", () => ({
	createClient: jest.fn(() => ({
		setEx: jest.fn(),
		get: jest.fn(),
	})),
}));

describe("AuthController", () => {
	let authController: AuthController;
	let mockAuthService: jest.Mocked<AuthService>;

	let req: Partial<Request>;
	let res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
		clearCookie: jest.fn(),
	} as Partial<Response>;
	let next: NextFunction;

	const fakeToken = "fake.jwt.token";

	beforeEach(() => {
		// Mock authService methods
		mockAuthService = {
			signup: jest.fn(),
			login: jest.fn(),
			logout: jest.fn(),
			userRepo: {},

			redis: createClient(),
			jwtSecret: "test",
		} as unknown as jest.Mocked<AuthService>;

		authController = new AuthController(mockAuthService);

		req = {
			body: {},
			cookies: {},
		};

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			clearCookie: jest.fn(),
		};

		next = jest.fn();
	});

	describe("signup", () => {
		it("should successfully sign up a user", async () => {
			const userData = { username: "john", password: "password" };
			req.body = userData;

			mockAuthService.signup.mockResolvedValueOnce({ userId: "12345", token: "345"});

			await authController.signup(req as Request, res as Response, next);

			expect(mockAuthService.signup).toHaveBeenCalledWith(userData);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
			expect(res.json).toHaveBeenCalledWith({
				message: "User registered successfully",
			});
		});

		it("should call next with error when signup fails", async () => {
			const error = new Error("Signup failed");
			mockAuthService.signup.mockRejectedValueOnce(error);

			await authController.signup(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("login", () => {
		it("should successfully log in a user", async () => {
			const userData = { username: "john", password: "password" };
			req.body = userData;

			mockAuthService.login.mockResolvedValueOnce({token: fakeToken});

			await authController.login(req as Request, res as Response, next);

			expect(mockAuthService.login).toHaveBeenCalledWith(userData);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
			expect(res.json).toHaveBeenCalledWith({
				message: "User logged in successfully",
				token: fakeToken,
			});
		});

		it("should call next with error when login fails", async () => {
			const error = new Error("Login failed");
			mockAuthService.login.mockRejectedValueOnce(error);

			await authController.login(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("logout", () => {
		it("should log out the user", async () => {
			const req = {
				headers: {
					authorization: `Bearer ${fakeToken}`,
				},
				cookies: {},
			} as Partial<Request>;

			mockAuthService.logout.mockResolvedValueOnce();

			await authController.logout(req as Request, res as Response, next);

			expect(mockAuthService.logout).toHaveBeenCalledWith(fakeToken);
			expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
			expect(res.json).toHaveBeenCalledWith({
				"message": "Successfully logged out",
				"success": true,
			});
		});

		it("should call next with error when logout fails", async () => {
			const error = new Error("Logout error");
			const req = {
			headers: {
					authorization: `Bearer ${fakeToken}`,
				},
				cookies: {},
			} as Partial<Request>;
			mockAuthService.logout.mockRejectedValueOnce(error);

			await authController.logout(req as Request, res as Response, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});
});
