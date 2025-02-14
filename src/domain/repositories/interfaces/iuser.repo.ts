import { CreateParams, Query } from "../../dto/user.dto";
import { User } from "../../entities/user.entity";

export default interface IUserRepo {
	create(payload: CreateParams): Promise<User>;

	findAll(query: Query): Promise<User[]>;

	findOne(query: Query, selectPassword: Boolean): Promise<User | null>;

	findById(id: string): Promise<User | null>;

	findByEmail(email: string): Promise<User | null>;

	findPaging(
		query: Query,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<User[]>;

	count(query: Query): Promise<number>;

	exists(email?: string, username?: string, id?: string): Promise<boolean>;

	deleteOne(id: string): Promise<boolean>;

	deleteMany(query: Query): Promise<number>;

	updateOne(query: Query): Promise<User | null>;

	updateMany(query: Query): Promise<number>;
}
