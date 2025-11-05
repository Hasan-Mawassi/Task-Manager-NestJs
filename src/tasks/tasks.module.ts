import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { LabelsModule } from "src/labels/labels.module";

@Module({
  imports: [TypeOrmModule.forFeature([Task]), LabelsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
