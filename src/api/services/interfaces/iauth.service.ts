import { JwtPayload } from "jsonwebtoken";
import {
	LoginInput,
	LoginOutput,
	SignupInput,
	SignupOutput,
} from "../../../domain/dto/auth.dto";

export default interface IAuthService {
	signup(signupInput: SignupInput): Promise<SignupOutput>;

	login(loginInput: LoginInput): Promise<LoginOutput>;

	verifyToken(token: string): Promise<JwtPayload>;

	logout(token: string): Promise<void>;
}
