import {API_URL} from "@/constants/config";
import {Task} from "@/constants/types";
import axios, {isAxiosError} from "axios";

export interface GetTodosResponse {
  success: boolean;
  data: Task[];
  count: number;
}

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
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Por favor, inicia sesión de nuevo.');
        }
      }
      throw new Error('Error al obtener las tareas');
    }
  }

  async function createTodo(task: Task): Promise<void> {
    try {
      await client.post('/todos', task);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Por favor, inicia sesión de nuevo.');
        }
      }
      throw new Error('Error al crear la tarea');
    }
  }

  async function deleteTodo(taskId: string): Promise<void> {
    try {
      await client.delete(`/todos/${ taskId }`);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Por favor, inicia sesión de nuevo.');
        }
      }
      throw new Error('Error al eliminar la tarea');
    }
  }

  async function updateTodo(task: Task): Promise<void> {
    try {
      await client.put(`/todos/${ task.id }`, task);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Por favor, inicia sesión de nuevo.');
        }
      }
      throw new Error('Error al actualizar la tarea');
    }
  }

  return {
    getAllTodos,
    createTodo,
    deleteTodo,
    updateTodo
  };
}