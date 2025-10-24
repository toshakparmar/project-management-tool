import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['active', 'completed'])
  @IsOptional()
  status?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'completed'])
  @IsOptional()
  status?: string;
}
