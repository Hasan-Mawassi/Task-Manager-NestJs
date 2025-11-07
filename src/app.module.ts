import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfigSchema } from "./config/config.types";
import { typeOrmConfig } from "./config/database.config";
import { TypedConfigService } from "./config/typed-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./tasks/entities/task.entity";
import { LabelsModule } from "./labels/labels.module";
import { Label } from "./labels/entities/label.entity";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { appConfig } from "./config/app.config";
import { authConfig } from "./config/auth.config";

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      load: [typeOrmConfig, appConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: TypedConfigService) => ({
        ...(await configService.get("database")),
        entities: [Task, Label, User],
      }),
    }),
    LabelsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: TypedConfigService, useExisting: ConfigService }],
})
export class AppModule {}
