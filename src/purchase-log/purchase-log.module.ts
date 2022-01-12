import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '../session/session.module';
import { TransactionalRepositoryModule } from '../transactional-repository/transactional-repository.module';
import { PurchaseLogRepository } from './purchase-log.repository';
import { PurchaseLogService } from './purchase-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseLogRepository]),
    TransactionalRepositoryModule,
    SessionModule,
  ],
  providers: [PurchaseLogService],
  exports: [PurchaseLogService],
})
export class PurchaseLogModule {}
