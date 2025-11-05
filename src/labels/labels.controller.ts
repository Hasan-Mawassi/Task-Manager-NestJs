import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from "@nestjs/common";
import { LabelsService } from "./labels.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { FindOneParam } from "./dto/id-param.dto";
import { Label } from "./entities/label.entity";
import { ApiNoContentResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreatedLabelDto } from "./dto/created-label.dto";

@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}
  /**
   * Create  Label
   */
  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }
  /**
   * Get all Labels
   */
  @ApiOkResponse({ type: [CreatedLabelDto], description: "List of labels" })
  @Get()
  findAll(): Promise<Label[]> {
    return this.labelsService.findAll();
  }
  /**
   * Get specific Label
   */
  @ApiOkResponse({ type: CreatedLabelDto, description: "Get Specific Label" })
  @Get(":id")
  findOne(@Param() { id }: FindOneParam) {
    return this.labelsService.findOne(id);
  }
  /**
   * Update specific Label
   */
  @Patch(":id")
  @ApiOkResponse({ type: CreatedLabelDto, description: "Label updated successfully" })
  update(@Param() { id }: FindOneParam, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelsService.update(id, updateLabelDto);
  }
  /**
   * Delete specific Label
   */
  @Delete(":id")
  @ApiNoContentResponse({ description: "Label deleted successfully" })
  @HttpCode(204)
  remove(@Param() { id }: FindOneParam) {
    return this.labelsService.remove(id);
  }
}
