import {Task} from '@/constants/types';
import getTodoService from '@/services/todo-service';
import {useRouter} from 'expo-router';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {Alert} from 'react-native';
import {useAuth} from './auth-context';

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
export const TasksProvider = ({children}: {children: ReactNode}) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const {user, logout} = useAuth();
    const router = useRouter();

    const todoService = useMemo(() => {
        if (!user) return null;
        return getTodoService({token: user.token});
    }, [user]);

    const fetchTodos = useCallback(async () => {
        if (!user || !todoService) return;
        setLoading(true);
        try {
            const todoService = getTodoService({token: user.token});
            const response = await todoService.getAllTodos();
            setAllTasks(response.data);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unauthorized')) {
                Alert.alert('Sesión expirada', 'Por favor, inicia sesión de nuevo.');
                logout();
                router.replace('/login');
            } else {
                Alert.alert(`Fallo al obtener las tareas de la API: ${ error }`);
            }
        } finally {
            setLoading(false);
        }
    }, [user, todoService, logout, router]);

    // --- EFECTO 1: Cargar tareas al iniciar y al cambiar de usuario ---
    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user, fetchTodos]); // Depende de la función de carga (que es estable)

    const addTask = async (task: Task) => {
        setLoading(true);
        try {
            const todoService = getTodoService({token: user!.token});
            await todoService.createTodo(task);
            await fetchTodos();
        } catch (error) {
            Alert.alert("Fallo al agregar la tarea a la API:");
        } finally {
            setLoading(false);
        }
    }

    //  Función para eliminar una tarea
    const deleteTask = async (taskId: string) => {
        setLoading(true);
        try {
            const todoService = getTodoService({token: user!.token});
            await todoService.deleteTodo(taskId);
            await fetchTodos();
        } catch (error) {
            Alert.alert(`Fallo al eliminar la tarea: ${ error } `);
        }
        setLoading(false);

    }

    //  Función para alternar el estado (completado/no completado)
    const toggleTask = async (taskId: string) => {
        setLoading(true);
        setAllTasks((prevTasks) =>
            prevTasks.map(task =>
                task.id === taskId ? {...task, completed: !task.completed} : task
            )
        );

        const updatedTask = allTasks.find(task => task.id === taskId);
        if (todoService && updatedTask) {
            const toggledTask = {...updatedTask, completed: !updatedTask.completed};
            try {
                await todoService.updateTodo(toggledTask);
                await fetchTodos();
            } catch (error) {
                Alert.alert(`Fallo al actualizar el estado de la tarea: ${ error } `);
            }
        }
        setLoading(false);
    };


    const contextValue = useMemo(() => ({
        tasks: allTasks,
        loading,
        addTask,
        deleteTask,
        toggleTask,
    }), [allTasks, loading, addTask, deleteTask, toggleTask]);

    return (
        <TasksContext.Provider value={contextValue}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks debe usarse dentro de un TasksProvider');
    }
    return context;
};