import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatedLabelDto {
  /**
   * Label ID
   * @example "UUID"
   */
  @IsUUID()
  @IsNotEmpty()
  id: string;

  /**
   * Label name
   * @example "daily task"
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
