import { DataSource } from 'typeorm';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import getConfigs from './src/config/config';

dotenv.config({
  path: './environments/local.env',
});

const postgresConfig = getConfigs().postgres;

export default new DataSource({
  type: 'postgres',
  host: postgresConfig.host,
  port: postgresConfig.port,
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.dbName,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: true,
});
