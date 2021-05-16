import { Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import {Task} from "./storage/task";
import { TaskStatus } from "./storage/task-status.enum";
import { TasksStatusValidationPipe } from "./pipes/tasks-status-validation.pipe";

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filteredTasksDto: FilteredTasksDto): Promise<Task[]> {
    return this.tasksService.getTasks(filteredTasksDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TasksStatusValidationPipe) newStatus: TaskStatus
  ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, newStatus);
  }
}
