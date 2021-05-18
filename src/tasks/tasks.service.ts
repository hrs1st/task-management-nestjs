import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { TaskStatus } from './storage/task-status.enum';
import { TaskRepository } from './storage/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './storage/task';
import { User } from '../../dist/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filteredTasksDto: FilteredTasksDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filteredTasksDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    return await this.taskRepository.getTaskById(id, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<Task> {
    return await this.taskRepository.removeTask(id, user);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus, user: User): Promise<Task> {
    return await this.taskRepository.updateTaskStatus(id, newStatus, user);
  }

}
