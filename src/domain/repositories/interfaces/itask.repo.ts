import { TCreateParams, TQuery } from "../../dto/task.dto";
import { Task } from "../../entities/task.entity";

export default interface ITaskRepo {
	create(payload: TCreateParams): Promise<Task>;

	findAll(query: TQuery): Promise<Task[]>;

	findOne(query: TQuery): Promise<Task | null>;

	findById(id: string): Promise<Task | null>;

	findPaging(
		query: TQuery,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<Task[]>;

	count(query: TQuery): Promise<number>;

	exists(name?: string, id?: string): Promise<boolean>;

	deleteOne(id: string): Promise<boolean>;

	deleteMany(query: TQuery): Promise<number>;

	updateOne(query: TQuery): Promise<Task | null>;

	updateMany(query: TQuery): Promise<number>;
}
