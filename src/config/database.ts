import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConnectionManager, getConnectionManager } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly dbConfig: any;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.dbConfig = this.configService.get('app');
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const connectionManager: ConnectionManager = getConnectionManager();
    const { dbUrl: url, synchronize, dbSsl: ssl } = this.dbConfig;
    let options: any;

    if (connectionManager.has('default')) {
      options = connectionManager.get('default').options;
      await connectionManager.get('default').close();
    } else {
      options = {
        type: 'postgres',
        url,
        keepConnectionAlive: true,
        autoLoadEntities: true,
        synchronize,
        ssl
      } as TypeOrmModuleOptions;
    }

    return options;
  }
}
