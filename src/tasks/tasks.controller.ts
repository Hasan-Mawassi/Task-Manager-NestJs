import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { FindOneParam } from "./dto/find-one-param.dto";
import { UpdateTaskException } from "./exceptions/update-task-status.exception";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  public async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get(":id")
  public async getTaskById(@Param() { id }: FindOneParam): Promise<Task | null> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  public async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch(":id")
  public async updateTask(
    @Param() { id }: FindOneParam,
    @Body() updatedTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findTaskOrFail(id);
    try {
      return await this.taskService.updateTask(task, updatedTaskDto);
    } catch (error) {
      if (error instanceof UpdateTaskException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() { id }: FindOneParam): Promise<void> {
    await this.findTaskOrFail(id);
    return this.taskService.deleteTask(id);
  }

  private async findTaskOrFail(id: string): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }
}
