import { DataSourceInitSuccess, DataSourceInitFail } from "src/application/services/connection.service";
import { DataSource } from "typeorm";

export const dsALTACENTRO = new DataSource({
  type: "mssql",
  host: "172.16.1.4",
  username: "sa",
  password: "GCl1n1c@M1712$",
  database: "DGEMPRES01",
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
  entities: ["dist/**/*.entity{.ts,.js}"],
});

const ctxt = "AC";

dsALTACENTRO
  .initialize()
  .then(() => {
    console.log(DataSourceInitSuccess(ctxt));
  })
  .catch(err => {
    console.error(DataSourceInitFail(ctxt), err);
  });
