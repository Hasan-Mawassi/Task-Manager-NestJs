import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { DataSource, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskStatus } from "./task.model";
import { UpdateTaskException } from "./exceptions/update-task-status.exception";
import { LabelsService } from "src/labels/labels.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
    private readonly labelsService: LabelsService,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ["labels"] });
  }

  public async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { labelNames = [], ...taskData } = createTaskDto;

    return this.dataSource.transaction(async (manager) => {
      // 1. ensure labels exist (transactional)
      const labels = await this.labelsService.getOrCreateLabels(labelNames, userId, manager);

      // 2. create and save task with labels
      const task = this.taskRepository.create({ ...taskData, labels, userId });
      return manager.save(task);
    });
  }

  public async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id }, relations: ["labels"] });
  }

  async updateTask(existingTask: Task, updateDto: UpdateTaskDto): Promise<Task> {
    if (
      existingTask.status &&
      !this.isValideTransition(existingTask.status, updateDto.status || TaskStatus.DONE)
    ) {
      throw new UpdateTaskException();
    }
    const { labelNames, ...rest } = updateDto;
    return await this.dataSource.transaction(async (manager) => {
      // load fresh task with relations
      const task = await manager.findOne(Task, {
        where: { id: existingTask.id },
        relations: ["labels"],
      });
      if (!task) {
        throw new Error(`Task with id ${existingTask.id} not found`);
      }
      // update fields
      Object.assign(task, rest);

      if (labelNames) {
        const labels = await this.labelsService.getOrCreateLabels(
          labelNames,
          existingTask.userId,
          manager,
        );
        task.labels = labels;
      }

      return manager.save(task);
    });
  }

  public async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  private isValideTransition(currentStatus: TaskStatus, nextStatus: TaskStatus): boolean {
    const statusOrder = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(nextStatus);
  }
}
