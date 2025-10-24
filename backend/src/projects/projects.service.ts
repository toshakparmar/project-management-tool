import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) { }

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,
      userId,
    });
    return project.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ projects: ProjectDocument[]; total: number; page: number; totalPages: number }> {
    const query: any = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.projectModel.countDocuments(query);
    const projects = await this.projectModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);

    Object.assign(project, updateProjectDto);
    return project.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectModel.findByIdAndDelete(id).exec();
  }
}
