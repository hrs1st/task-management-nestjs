import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { Task } from './storage/task';
import { TaskStatus } from './storage/task-status.enum';
import { TasksStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
      @Query(ValidationPipe) filteredTasksDto: FilteredTasksDto,
      @Req() req
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filteredTasksDto, req.user);
  }

  @Get('/:id')
  async getTaskById(
      @Param('id', ParseIntPipe) id: number,
      @Req() req
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
      @Body() createTaskDto: CreateTaskDto,
      @Req() req
  ): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto, req.user);
  }

  @Delete('/:id')
  async deleteTask(
      @Param('id', ParseIntPipe) id: number,
      @Req() req
  ): Promise<Task> {
    return await this.tasksService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TasksStatusValidationPipe) newStatus: TaskStatus,
    @Req() req
  ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, newStatus, req.user);
  }
}
