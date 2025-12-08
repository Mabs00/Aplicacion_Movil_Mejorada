import { Task } from '@/constants/types';
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useAuth } from './auth-context';
// 🚨 Importar la URL base de la API
import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Todavía necesario para obtener el user_id

// --- TIPOS ---
interface TasksContextType {
    tasks: Task[];
    loading: boolean;
    addTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    toggleTask: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// --- PROVEEDOR ---
export const TasksProvider = ({ children }: { children: ReactNode }) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // --- FUNCIONALIDAD DE LECTURA (GET) DESDE LA API ---
    const loadTasksFromAPI = useCallback(async () => {
        setLoading(true);
        try {
            // Obtenemos el ID del usuario, que es la clave para la API
            const userId = user?.id || await AsyncStorage.getItem('user_id');

            if (!userId) {
                setAllTasks([]);
                return;
            }

            // 🎯 Llamada a la API con filtro de userId
            const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const apiTasks: Task[] = await response.json();
            setAllTasks(apiTasks);

        } catch (error) {
            console.error("Fallo al obtener tareas de la API:", error);
        } finally {
            setLoading(false);
        }
    }, [user]); // Se ejecuta al inicio, y si el objeto user cambia (ej. al loguearse)

    // --- EFECTO 1: Cargar tareas al iniciar y al cambiar de usuario ---
    useEffect(() => {
        // Reemplazamos la lógica de AsyncStorage con la llamada a la API
        loadTasksFromAPI();
    }, [loadTasksFromAPI]); // Depende de la función de carga (que es estable)



    // Función para agregar una nueva tarea (MODIFICADA CON POST A LA API)
    const addTask = useCallback(async (task: Task) => {
        try {
            // 1. Prepara la solicitud POST
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST', // Método para crear recursos
                headers: {
                    'Content-Type': 'application/json',
                },
                // 2. Envía la tarea como JSON
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                // Si la API falla, lanzamos un error y no modificamos el estado local
                throw new Error(`Fallo en el POST: ${response.statusText}`);
            }

            // 3. Opcional: Obtener la tarea devuelta por la API (con ID asignado)
            // La API de Hono generalmente devuelve el objeto creado
            const newTaskFromAPI: Task = await response.json();

            // 4. Actualizar estado local (SOLO si la API fue exitosa)
            setAllTasks((prevTasks) => [...prevTasks, newTaskFromAPI]);

        } catch (error) {
            console.error("Fallo al crear la tarea en la API:", error);
            // Aquí podrías mostrar una alerta al usuario indicando el fallo
        }
    }, []); // Dependencias vacías: esta función es estable

    // En context/TasksContext.tsx (dentro del TasksProvider)

    //  Función para eliminar una tarea (MODIFICADA CON DELETE A LA API)
    const deleteTask = useCallback(async (taskId: string) => {
        try {
            // 1. Enviar la solicitud DELETE con el ID de la tarea
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE', // Método para eliminar recursos
            });

            if (!response.ok) {
                // Si la API falla, lanzamos un error
                throw new Error(`Fallo en el DELETE: ${response.statusText}`);
            }

            // 2. Actualizar estado local (SOLO si la API fue exitosa)
            setAllTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));

        } catch (error) {
            console.error("Fallo al eliminar la tarea en la API:", error);
            // Mostrar una alerta de fallo al usuario
        }
    }, []); // Dependencias vacías

    //  Función para alternar el estado (completado/no completado)
    const toggleTask = useCallback((taskId: string) => {
        setAllTasks((prevTasks) =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    // 3. Filtrar Tareas (Sin cambios)
    const userTasks = useMemo(() => {
        if (!user) return [];
        return allTasks.filter(task => task.userId === user.id);
    }, [allTasks, user]);


    const contextValue = useMemo(() => ({
        tasks: userTasks,
        loading,
        addTask,
        deleteTask,
        toggleTask,
    }), [userTasks, loading, addTask, deleteTask, toggleTask]);

    return (
        <TasksContext.Provider value={contextValue}>
            {children}
        </TasksContext.Provider>
    );
};

// ... (El hook useTasks no cambia)
export const useTasks = () => {
    // ...
};