import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return task.save();
  }

  async findAll(userId: string, projectId?: string, status?: string): Promise<TaskDocument[]> {
    const query: any = { userId };

    if (projectId) {
      query.projectId = projectId;
    }

    if (status) {
      query.status = status;
    }

    return this.taskModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskModel.findByIdAndDelete(id).exec();
  }
}
