import { PCreateParams, PQuery } from "../../dto/project.dto";
import { Project } from "../../entities/project.entity";

export default interface IProjectRepo {
	create(payload: PCreateParams): Promise<Project>;

	findAll(query: PQuery): Promise<Project[]>;

	findOne(query: PQuery): Promise<Project | null>;

	findById(id: string): Promise<Project | null>;

	findPaging(
		query: PQuery,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<Project[]>;

	count(query: PQuery): Promise<number>;

	exists(name?: string, id?: string): Promise<boolean>;

	deleteOne(id: string): Promise<boolean>;

	deleteMany(query: PQuery): Promise<number>;

	updateOne(query: PQuery): Promise<Project | null>;

	updateMany(query: PQuery): Promise<number>;
}
