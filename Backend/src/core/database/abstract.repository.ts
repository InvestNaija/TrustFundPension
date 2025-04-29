import {
    DeepPartial,
    DeleteResult,
    EntityTarget,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    QueryRunner,
    Repository,
    SelectQueryBuilder,
    ObjectLiteral,
    UpdateResult,
  } from 'typeorm';
  import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
  
  export abstract class AbstractRepository<T extends ObjectLiteral> {
    protected constructor(
      protected readonly repository: Repository<T>,
      private readonly entity: EntityTarget<T>,
    ) {}
  
    createQueryBuilder(alias: string): SelectQueryBuilder<T> {
      return this.repository.createQueryBuilder(alias);
    }
  
    async save(
      record: DeepPartial<T>,
      transactionQueryRunner?: QueryRunner,
    ): Promise<T> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.save(this.entity, record);
      }
  
      return await this.repository.save(record);
    }
  
    async bulkSave(
      records: DeepPartial<T>[],
      transactionQueryRunner?: QueryRunner,
    ): Promise<T[]> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.save(this.entity, records);
      }
  
      return await this.repository.save(records);
    }
  
    async findOne(query: FindOneOptions<T>): Promise<T | null> {
      const record = await this.repository.findOne(query);
      return record;
    }
  
    async find(options?: FindManyOptions<T>): Promise<T[]> {
      return await this.repository.find(options);
    }
  
    async findMany(query: FindManyOptions<T>): Promise<T[]> {
      const records = await this.repository.find(query);
      return records;
    }
  
    async update(
      options: FindOptionsWhere<T>,
      values: QueryDeepPartialEntity<T>,
      transactionQueryRunner?: QueryRunner,
    ): Promise<UpdateResult> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.update(
          this.entity,
          { ...options },
          values,
        );
      }
  
      return await this.repository.update({ ...options }, values);
    }
  
    async delete(
      options: FindOptionsWhere<T>,
      transactionQueryRunner?: QueryRunner,
    ): Promise<DeleteResult> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.delete(this.entity, options);
      }
  
      return await this.repository.delete(options);
    }
  
    async count(query?: FindManyOptions<T>): Promise<number> {
      const count = await this.repository.count(query);
      return count;
    }
  
    async increment(
      options: FindOptionsWhere<T>,
      propertyPath: string,
      value: number | string,
      transactionQueryRunner?: QueryRunner,
    ): Promise<UpdateResult> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.increment(
          this.entity,
          options,
          propertyPath,
          value,
        );
      }
  
      return await this.repository.increment(options, propertyPath, value);
    }
  
    async softDelete(
      options: FindOptionsWhere<T>,
      transactionQueryRunner?: QueryRunner,
    ): Promise<UpdateResult> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.softDelete(this.entity, options);
      }
  
      return await this.repository.softDelete(options);
    }
  
    async restore(
      options: FindOptionsWhere<T>,
      transactionQueryRunner?: QueryRunner,
    ): Promise<UpdateResult> {
      if (transactionQueryRunner) {
        return await transactionQueryRunner.manager.restore(this.entity, options);
      }
  
      return await this.repository.restore(options);
    }
  }