import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { NotFoundException } from "@nestjs/common";
import { FilteredTasksDto } from "../dto/filtered-tasks.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async getTasks(filteredTasksDto: FilteredTasksDto): Promise<Task[]> {
    const { status , search } = filteredTasksDto;
    const queryBuilder = this.createQueryBuilder('task');

    if (status) {
      queryBuilder.andWhere('task.taskStatus= :status', {status});
    }
    if (search) {
      queryBuilder.andWhere('(task.title LIKE :search OR task.description LIKE :search)',
        {search: `%${search}%`});
    }

    return await queryBuilder.getMany();
  }

  async getTaskById(id: number) {
    const foundTask = await this.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID:${id} doesn't exist`);
    }
    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title , description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.taskStatus = TaskStatus.OPEN;
    await task.save();

    return task;
  }

  async removeTask(id: number): Promise<Task> {
    const foundTask = await this.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Couldn't find selected task!`);
    }
    return await this.remove(foundTask);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus): Promise<Task> {
    const foundTask = await this.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Couldn't find selected task!`);
    }
    foundTask.taskStatus = newStatus;
    await foundTask.save();

    return foundTask;
  }
}