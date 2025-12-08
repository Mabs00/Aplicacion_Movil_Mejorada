import axios, { isAxiosError } from 'axios';
import { API_URL } from '../constants/config';

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
  }
}

export type RegisterPayload = LoginPayload;

export type RegisterResponse = LoginResponse;

export default function getAuthService() {

  const client = axios.create({
    baseURL: `${API_URL}/auth`,

  })

  async function login(loginPayload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginResponse>('/login', loginPayload)
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Credenciales inválidas');
        }
      }
      throw new Error('Error al iniciar sesión. Por Favor, inténtalo nuevamente.');
    }
  }

  async function register(registerPayload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await client.post<RegisterResponse>('/register', registerPayload)
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          throw new Error('El email ya está registrado');
        }
      }
      throw new Error('Error al registrar el usuario. Por Favor, inténtalo nuevamente.');
    }
  }

  return {
    login,
    register
  }
}