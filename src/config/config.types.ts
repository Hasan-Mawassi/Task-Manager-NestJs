import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as Joi from "Joi";
import { AppConfig } from "./app.config";

export interface ConfigTypes {
  app: AppConfig;
  database: TypeOrmModuleOptions;
}

export const appConfigSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().default("postgres"),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.number().valid(0, 1).required(),
});
