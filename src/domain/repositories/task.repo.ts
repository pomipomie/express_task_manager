import { TCreateParams, TQuery } from "../dto/task.dto";
import ITaskRepo from "./interfaces/itask.repo";
import Task, { Mapper } from "../../data/models/task.model";
import { Task as TaskEntity } from "../entities/task.entity";

export default class TaskRepo implements ITaskRepo {
	async create(payload: TCreateParams): Promise<TaskEntity> {
		const doc = await Task.create(payload);
		return Mapper.toEntity(doc);
	}

	async findAll(query: TQuery): Promise<TaskEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const docs = await Task.find(queryObj);
		const entities = docs.map((doc) => Mapper.toEntity(doc));
		return entities;
	}

	async findOne(query: TQuery): Promise<TaskEntity | null> {
		let doc = null;
		doc = await Task.findOne({ ...Mapper.toQuery(query) });
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findById(id: string): Promise<TaskEntity | null> {
		const doc = await Task.findById(id);
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findPaging(
		query: TQuery,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<TaskEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const sortObj = sort || { id: -1 };

		const docs = await Task.find(queryObj)
			.skip(offset)
			.limit(limit)
			.sort(sortObj);

		const entities = docs.map((doc) => Mapper.toEntity(doc));

		return entities;
	}

	async findMany(query: TQuery): Promise<TaskEntity[]> {
		const queryObj = { ...Mapper.toQuery(query) };
		const docs = await Task.find(queryObj);
		const entities = docs.map((doc) => Mapper.toEntity(doc));
		return entities;
	}

	async count(query: TQuery): Promise<number> {
		let queryObj = { ...Mapper.toQuery(query) };
		const count = await Task.countDocuments(queryObj);
		return count;
	}

	async exists(name?: string, id?: string): Promise<boolean> {
		const doc = await Task.findOne({
			...(name && { name }),
			...(id && { id: { $ne: id } }),
		});

		return doc ? true : false;
	}

	async deleteOne(id: string): Promise<boolean> {
		const result = await Task.deleteOne({ _id: id });
		return result.deletedCount === 1;
	}

	async deleteMany(query: TQuery): Promise<number> {
		const result = await Task.deleteMany({
			...Mapper.toQuery(query),
		});

		return result.deletedCount;
	}

	async updateOne(query: TQuery): Promise<TaskEntity | null> {
		const { id, ...values } = Mapper.toQuery(query);
		// null props of updates means delete ==> put in $unset
		const updates: Record<string, any> = {};
		const deleteUpdates: Record<string, any> = {};

		// remove null values and add them to delete
		for (const [key, value] of Object.entries(values)) {
			if (value === null) {
				deleteUpdates[key] = 1;
			} else {
				updates[key] = value;
			}
		}

		const update = { $set: { ...updates }, $unset: { ...deleteUpdates } };

		const updatedDoc = await Task.findByIdAndUpdate(id, update, { new: true });

		return updatedDoc ? Mapper.toEntity(updatedDoc) : null;
	}

	async updateMany(query: TQuery): Promise<number> {
		const { id, ...updates } = Mapper.toQuery(query);
		const update = { $set: { ...updates } };
		const result = await Task.updateMany({ id }, update);

		return result.matchedCount;
	}
}
