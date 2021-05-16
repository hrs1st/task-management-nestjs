import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import {TaskStatus} from "../storage/task-status.enum";

export class FilteredTasksDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}