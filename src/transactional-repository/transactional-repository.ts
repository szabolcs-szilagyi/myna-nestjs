import { Global, Injectable, Scope } from '@nestjs/common';
import {
  Connection,
  EntityManager,
  EntitySchema,
  ObjectType,
  Repository,
} from 'typeorm';
import { RepositoryFactory } from 'typeorm/repository/RepositoryFactory';

@Global()
@Injectable({ scope: Scope.REQUEST })
export class TransactionalRepository {
  private transactionManager: EntityManager | null;

  constructor(private connection: Connection) {}

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    this.transactionManager = queryRunner.manager;
    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.transactionManager = null;
    }
  }

  /**
   * Gets a repository bound to the current transaction manager
   * or defaults to the current connection's call to getRepository().
   */
  getRepository<Entity>(
    target: ObjectType<Entity> | EntitySchema<Entity> | string,
  ): Repository<Entity> {
    if (this.transactionManager) {
      const metadata = this.connection.getMetadata(target);
      return new RepositoryFactory().create(this.transactionManager, metadata);
    }
    return this.connection.getRepository(target);
  }

  getCustomRepository<EntityRepository>(
    target: ObjectType<EntityRepository>,
  ): EntityRepository {
    if (this.transactionManager) {
      return this.transactionManager.getCustomRepository(target);
    }
    return this.connection.getCustomRepository(target);
  }
}
