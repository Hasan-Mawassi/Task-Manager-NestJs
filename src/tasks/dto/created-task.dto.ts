import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { TaskStatus } from "../task.model";

export class CreatedTaskDto {
  /**
   * Task ID
   * @example "UUID String"
   */
  @IsUUID()
  @IsNotEmpty()
  id: string;

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
