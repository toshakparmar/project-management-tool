import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['todo', 'in-progress', 'done'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['todo', 'in-progress', 'done'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
