export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}
