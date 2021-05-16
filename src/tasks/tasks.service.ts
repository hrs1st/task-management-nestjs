import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import {TaskStatus} from "./storage/task-status.enum";
import {TaskRepository} from "./storage/task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./storage/task";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filteredTasksDto: FilteredTasksDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filteredTasksDto);
  }

  async getTaskById(id: number): Promise<Task> {
    return await this.taskRepository.getTaskById(id);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<Task> {
    return await this.taskRepository.removeTask(id);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus): Promise<Task> {
    return await this.taskRepository.updateTaskStatus(id, newStatus);
  }

}
