import { PCreateParams, PQuery } from "../dto/project.dto";
import Project, { Mapper } from "../../data/models/project.model";
import { Project as ProjectEntity } from "../entities/project.entity";
import IProjectRepo from "./interfaces/iproject.repo";

export default class ProjectRepo implements IProjectRepo {
	async create(payload: PCreateParams): Promise<ProjectEntity> {
		const doc = await Project.create(payload);
		return Mapper.toEntity(doc);
	}

	async findAll(query: PQuery): Promise<ProjectEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const docs = await Project.find(queryObj);
		const entities = docs.map((doc) => Mapper.toEntity(doc));
		return entities;
	}

	async findOne(query: PQuery): Promise<ProjectEntity | null> {
		let doc = null;
		doc = await Project.findOne({ ...Mapper.toQuery(query) });
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findById(id: string): Promise<ProjectEntity | null> {
		const doc = await Project.findById(id);
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findPaging(
		query: PQuery,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<ProjectEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const sortObj = sort || { id: -1 };

		const docs = await Project.find(queryObj)
			.skip(offset)
			.limit(limit)
			.sort(sortObj);

		const entities = docs.map((doc) => Mapper.toEntity(doc));

		return entities;
	}

	async count(query: PQuery): Promise<number> {
		let queryObj = { ...Mapper.toQuery(query) };
		const count = await Project.countDocuments(queryObj);
		return count;
	}

	async exists(name?: string, id?: string): Promise<boolean> {
		const doc = await Project.findOne({
			...(name && { name }),
			...(id && { id: { $ne: id } }),
		});

		return doc ? true : false;
	}

	async deleteOne(id: string): Promise<boolean> {
		const result = await Project.deleteOne({ _id: id });
		return result.deletedCount === 1;
	}

	async deleteMany(query: PQuery): Promise<number> {
		const result = await Project.deleteMany({
			...Mapper.toQuery(query),
		});

		return result.deletedCount;
	}

	async updateOne(query: PQuery): Promise<ProjectEntity | null> {
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

		const updatedDoc = await Project.findByIdAndUpdate(id, update, {
			new: true,
		});

		return updatedDoc ? Mapper.toEntity(updatedDoc) : null;
	}

	async updateMany(query: PQuery): Promise<number> {
		const { id, ...updates } = Mapper.toQuery(query);
		const update = { $set: { ...updates } };
		const result = await Project.updateMany({ id }, update);

		return result.matchedCount;
	}
}
