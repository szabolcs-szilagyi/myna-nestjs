import { Module } from '@nestjs/common';
import { TransactionalRepository } from './transactional-repository';

@Module({
  providers: [TransactionalRepository],
  exports: [TransactionalRepository],
})
export class TransactionalRepositoryModule {}
