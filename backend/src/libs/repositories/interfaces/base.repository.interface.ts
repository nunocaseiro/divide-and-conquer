import { FilterQuery, PopulateOptions, QueryOptions, UpdateQuery } from 'mongoose';
import { ModelProps, SelectedValues } from '../types';

export type PopulateType = PopulateOptions | (PopulateOptions | string)[];

export interface BaseInterfaceRepository<T> {
	findAll(selectedValues?: SelectedValues<T>): Promise<T[]>;

	findOneById(id: any, selectedValues?: SelectedValues<T>, populate?: PopulateType): Promise<T>;

	findAllWithQuery(
		query: any,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType
	): Promise<T[]>;

	findOneByField(fields: ModelProps<T>): Promise<T>;

	create(item: T): Promise<T>;

	insertMany(listOfItems: T[]): Promise<T[]>;

	update(id: string, item: T): Promise<T>;

	deleteMany(field: FilterQuery<T>, withSession: boolean): Promise<number>;

	countDocuments(): Promise<number>;

	findOneByFieldAndUpdate(
		value: ModelProps<T>,
		query: UpdateQuery<T>,
		options?: QueryOptions<T>
	): Promise<T>;

	findOneAndRemoveByField(fields: ModelProps<T>, withSession: boolean): Promise<T>;

	startTransaction(): Promise<void>;

	commitTransaction(): Promise<void>;

	abortTransaction(): Promise<void>;

	endSession(): Promise<void>;
}