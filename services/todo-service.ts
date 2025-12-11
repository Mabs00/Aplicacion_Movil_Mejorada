import {API_URL} from "@/constants/config";
import {Task} from "@/constants/types";
import axios, {isAxiosError} from "axios";

export interface GetTodosResponse {
  success: boolean;
  data: Task[];
  count: number;
}

function handlerServiceError(error: unknown): never {
  if (isAxiosError(error) && error.response) {
    if (error.response.status === 401) {
      throw new Error('Unauthorized: Por favor, inicia sesión de nuevo.');
    }
  }
  throw new Error('Error al conectarse con el servidor. Por favor intente mas tarde');
};


export default function getTodoService({token}: {token: string}) {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${ token }`,
    },
  });

  async function getAllTodos(): Promise<GetTodosResponse> {

    try {
      const response = await client.get<GetTodosResponse>('/todos');
      return response.data;
    } catch (error) {
      handlerServiceError(error);
    }
  }

  async function createTodo(task: Task): Promise<void> {
    try {
      await client.post('/todos', task);
    } catch (error) {
      handlerServiceError(error);
    }
  }

  async function deleteTodo(taskId: string): Promise<void> {
    try {
      await client.delete(`/todos/${ taskId }`);
    } catch (error) {
      handlerServiceError(error);
    }
  }

  async function updateTodo(task: Task): Promise<void> {
    try {
      await client.put(`/todos/${ task.id }`, task);
    } catch (error) {
      handlerServiceError(error);
    }
  }
  return {
    getAllTodos,
    createTodo,
    deleteTodo,
    updateTodo
  };
}