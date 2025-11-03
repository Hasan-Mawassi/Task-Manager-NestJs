import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskStatus } from "./task.model";
import { UpdateTaskException } from "./exceptions/update-task-status.exception";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.save(createTaskDto);
  }

  public async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id });
  }

  public async updateTask(task: Task, updatedTaskDto: UpdateTaskDto): Promise<Task> {
    if (
      task.status &&
      !this.isValideTransition(task.status, updatedTaskDto.status || TaskStatus.DONE)
    ) {
      throw new UpdateTaskException();
    }

    Object.assign(task, updatedTaskDto);
    return await this.taskRepository.save(task);
  }

  public async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  private isValideTransition(currentStatus: TaskStatus, nextStatus: TaskStatus): boolean {
    const statusOrder = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(nextStatus);
  }
}
