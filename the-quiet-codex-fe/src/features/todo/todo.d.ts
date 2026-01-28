export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  tagId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface TodoFiltersState {
  status: "all" | "active" | "completed";
  tagId: string | null;
  searchQuery: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  tagId?: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  tagId?: string;
}
