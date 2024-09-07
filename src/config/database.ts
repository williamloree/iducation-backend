import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  host: "db",
  port: 5432,
  username: "postgres",
  // password: "password",
  password: "8SBwotk2lUX",
  database: "iducation",
  dropSchema: false,
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});