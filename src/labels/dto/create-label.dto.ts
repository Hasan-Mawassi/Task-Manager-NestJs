import { IsNotEmpty, IsString } from "class-validator";

export class CreateLabelDto {
  /**
   * Label name
   * @example "daily task"
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
