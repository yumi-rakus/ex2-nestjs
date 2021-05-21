import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from '../src/users/users.entity';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService();

    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOSTNAME'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [UsersEntity],
      synchronize: this.strToBoolean(
        configService.get<string>('DB_SYNC', 'false'),
      ),
    };
  }

  // get<boolean>が上手く変換してくれないため泣く泣く対応
  private strToBoolean(boolStr: string): boolean {
    switch (boolStr.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case null:
        return false;
      default:
        return boolStr as unknown as boolean;
    }
  }
}
