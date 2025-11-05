import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "../task.model";

export class CreateTaskDto {
  /**
   * Task title
   * @example "Code"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Task description
   * @example "Write code for the task manager application"
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Task status
   * @example "OPEN"
   */
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
