import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../storage/task-status.enum';

export class TasksStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ]

  transform(value: any): any {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`Entered status ${value} is invalid!`);
    } else {
      return value;
    }
  }

  isStatusValid(value: any): boolean {
    const index = this.allowedStatuses.indexOf(value);
    return index > -1;
  }

}