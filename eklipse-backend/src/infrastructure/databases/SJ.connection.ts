import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const conSJ: TypeOrmModuleOptions = {
  type: "mssql",
  host: '*******',
  username:  '*******',
  password:  '*******',
  database: "DGEMPRES70",
  synchronize: false,
  logging: false,
  options: {
    encrypt: false,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    validateConnection: false,
    trustServerCertificate: true,
  },
  requestTimeout: 200000,
  retryDelay: 3000,
  retryAttempts: 10,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
};
