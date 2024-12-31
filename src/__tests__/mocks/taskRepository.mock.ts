import { TCreateParams, TQuery } from "../../domain/dto/task.dto";
import ITaskRepo from "../../domain/repositories/interfaces/itask.repo";
import { Task as TaskEntity } from "../../domain/entities/task.entity";

export default class MockTaskRepo implements ITaskRepo {
	private tasks: TaskEntity[] = [];
	private nextId = 1;

	async create(payload: TCreateParams): Promise<TaskEntity> {
		const newTask: TaskEntity = {
			id: this.nextId.toString(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...payload,
		};
		this.tasks.push(newTask);
		this.nextId += 1;
		return newTask;
	}

	async findAll(query: TQuery): Promise<TaskEntity[]> {
		return this.tasks.filter((task) =>
			Object.entries(query).every(
				([key, value]) => task[key as keyof TaskEntity] === value
			)
		);
	}

	async findOne(query: TQuery): Promise<TaskEntity | null> {
		return (
			this.tasks.find((task) =>
				Object.entries(query).every(
					([key, value]) => task[key as keyof TaskEntity] === value
				)
			) || null
		);
	}

	async findById(id: string): Promise<TaskEntity | null> {
		return this.tasks.find((task) => task.id === id) || null;
	}

	async findPaging(
		query: TQuery,
		offset: number,
		limit: number,
		sort?: {}
	): Promise<TaskEntity[]> {
		const filteredTasks = this.tasks.filter((task) =>
			Object.entries(query).every(
				([key, value]) => task[key as keyof TaskEntity] === value
			)
		);

		if (sort) {
			const [sortKey, sortOrder] = Object.entries(sort)[0];
			filteredTasks.sort((a, b) => {
				const valueA = a[sortKey as keyof TaskEntity];
				const valueB = b[sortKey as keyof TaskEntity];

				if (typeof valueA === "string" && typeof valueB === "string") {
					return sortOrder === -1
						? valueB.localeCompare(valueA)
						: valueA.localeCompare(valueB);
				}

				if (valueA instanceof Date && valueB instanceof Date) {
					return sortOrder === -1
						? valueB.getTime() - valueA.getTime()
						: valueA.getTime() - valueB.getTime();
				}

				// For other types, you can define a fallback behavior
				return 0; // No sorting for unsupported types
			});
		}

		return filteredTasks.slice(offset, offset + limit);
	}

	async count(query: TQuery): Promise<number> {
		return this.tasks.filter((task) =>
			Object.entries(query).every(
				([key, value]) => task[key as keyof TaskEntity] === value
			)
		).length;
	}

	async exists(name?: string, id?: string): Promise<boolean> {
		return this.tasks.some(
			(task) =>
				(name && task.name === name) || (id && task.id !== id && task.id === id)
		);
	}

	async deleteOne(id: string): Promise<boolean> {
		const initialLength = this.tasks.length;
		this.tasks = this.tasks.filter((task) => task.id !== id);
		return this.tasks.length < initialLength;
	}

	async deleteMany(query: TQuery): Promise<number> {
		const initialLength = this.tasks.length;
		this.tasks = this.tasks.filter(
			(task) =>
				!Object.entries(query).every(
					([key, value]) => task[key as keyof TaskEntity] === value
				)
		);
		return initialLength - this.tasks.length;
	}

	async updateOne(query: TQuery): Promise<TaskEntity | null> {
		const { id, ...updates } = query;
		const taskIndex = this.tasks.findIndex((task) => task.id === id);

		if (taskIndex !== -1) {
			const updatedTask = { ...this.tasks[taskIndex], ...updates };
			this.tasks[taskIndex] = updatedTask;
			return updatedTask;
		}

		return null;
	}

	async updateMany(query: TQuery): Promise<number> {
		const { id, ...updates } = query;
		let updateCount = 0;

		this.tasks.forEach((task, index) => {
			if (task.id === id) {
				this.tasks[index] = { ...task, ...updates };
				updateCount += 1;
			}
		});

		return updateCount;
	}
}
