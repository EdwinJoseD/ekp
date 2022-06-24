import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ConnectionSJ: TypeOrmModuleOptions = {
  type: 'mssql',
  host: '*******',
  username:  '*******',
  password:  '*******',
  database: 'DGEMPRES70',
  synchronize: false,
  logging: false,
  options: {
    encrypt: false,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1',
    },
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    validateConnection: false,
    trustServerCertificate: true,
  },
  requestTimeout: 300000,
  entities: ['src/**/*.entity{.ts,.js} || dist/**/*.entity{.ts,.js}'],
};
