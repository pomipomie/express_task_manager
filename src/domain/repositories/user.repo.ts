import { CreateParams, Query } from "../dto/user.dto";
import IUserRepo from "./interfaces/iuser.repo";
import User, { Mapper } from "../../data/models/user.model";
import { User as UserEntity } from "../entities/user.entity";

export default class UserRepo implements IUserRepo {
	async create(payload: CreateParams): Promise<UserEntity> {
		const userPayload = {
			...payload, // Spread other fields from payload
			auth: {
				// Add the password inside the `auth` object
				password: payload.password,
			},
		};
		const doc = await User.create(userPayload);
		return Mapper.toEntity(doc);
	}

	async findAll(query: Query): Promise<UserEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const docs = await User.find(queryObj);
		const entities = docs.map((doc) => Mapper.toEntity(doc));
		return entities;
	}

	async findOne(
		query: Query,
		selectPassword: Boolean
	): Promise<UserEntity | null> {
		let doc = null;

		if (selectPassword)
			doc = await User.findOne({ ...Mapper.toQuery(query) }).select(
				"+password"
			);
		else doc = await User.findOne({ ...Mapper.toQuery(query) });

		return doc ? Mapper.toEntity(doc) : null;
	}

	async findById(id: string): Promise<UserEntity | null> {
		const doc = await User.findById(id);
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const query: Query = { email };
		const mongoQuery = Mapper.toQuery(query);
		const doc = await User.findOne(mongoQuery);
		return doc ? Mapper.toEntity(doc) : null;
	}

	async findPaging(
		query: Query,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<UserEntity[]> {
		let queryObj = { ...Mapper.toQuery(query) };
		const sortObj = sort || { id: -1 };

		const docs = await User.find(queryObj)
			.skip(offset)
			.limit(limit)
			.sort(sortObj);

		const entities = docs.map((doc) => Mapper.toEntity(doc));

		return entities;
	}
	async count(query: Query): Promise<number> {
		let queryObj = { ...Mapper.toQuery(query) };
		const count = await User.countDocuments(queryObj);
		return count;
	}
	async exists(
		email?: string,
		username?: string,
		id?: string
	): Promise<boolean> {
		const doc = await User.findOne({
			...(email && { email }),
			...(username && { username }),
			...(id && { id: { $ne: id } }),
		});

		return doc ? true : false;
	}

	async deleteOne(id: string): Promise<boolean> {
		const result = await User.deleteOne({ _id: id });

		return result.deletedCount === 1;
	}

	async deleteMany(query: Query): Promise<number> {
		const result = await User.deleteMany({
			...Mapper.toQuery(query),
		});

		return result.deletedCount;
	}

	async updateOne(query: Query): Promise<UserEntity | null> {
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

		const updatedDoc = await User.findByIdAndUpdate(id, update, { new: true });

		return updatedDoc ? Mapper.toEntity(updatedDoc) : null;
	}

	async updateMany(query: Query): Promise<number> {
		const { id, ...updates } = Mapper.toQuery(query);
		const update = { $set: { ...updates } };
		const result = await User.updateMany({ id }, update);

		return result.matchedCount;
	}
}
