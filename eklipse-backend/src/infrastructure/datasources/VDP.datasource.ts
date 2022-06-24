import { DataSourceInitFail, DataSourceInitSuccess } from "src/application/services/connection.service";
import { DataSource } from "typeorm";

export const dsVALLEDUPAR = new DataSource({
  type: "mssql",
  host: "192.168.1.253",
  username: "dnet2011",
  password: "Dn3t122011",
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

const ctxt = "VDP";

dsVALLEDUPAR
  .initialize()
  .then(() => {
    console.log(DataSourceInitSuccess(ctxt));
  })
  .catch(err => {
    console.error(DataSourceInitFail(ctxt), err);
  });
