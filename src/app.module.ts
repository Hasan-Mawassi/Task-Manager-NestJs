import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfigSchema } from "./config/config.types";
import { typeOrmConfig } from "./config/database.config";
import { TypedConfigService } from "./config/typed-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get("database"),
        entities: [],
      }),
    }),
    ConfigModule.forRoot({
      load: [typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: TypedConfigService, useExisting: ConfigService }],
})
export class AppModule {}
