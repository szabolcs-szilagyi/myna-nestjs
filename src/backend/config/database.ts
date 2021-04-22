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
    this.dbConfig = configService.get('database');
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const connectionManager: ConnectionManager = getConnectionManager();
    const { url, synchronize } = this.dbConfig;
    let options: any;

    if (connectionManager.has('default')) {
      options = connectionManager.get('default').options;
      await connectionManager.get('default').close();
    } else {
      options = {
        type: 'mysql',
        url,
        keepConnectionAlive: true,
        autoLoadEntities: true,
        synchronize,
      };
    }

    return options;
  }
}
