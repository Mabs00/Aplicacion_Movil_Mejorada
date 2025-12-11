import {COLORS} from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native"; // Asegúrate de importar ActivityIndicator
import {useTasks} from '../../context/task-context';
import AddTaskView from "../components/add-task";
import Spinner from "../components/spinner";
import TaskItem from "../components/task-item";

export default function TodoView() {
  // OBTIENE ESTADO Y FUNCIONES DEL CONTEXTO
  const {
    tasks,
    loading,
    toggleTask,
    deleteTask,
  } = useTasks();

  // El estado local solo maneja la visibilidad del formulario
  const [creatingNew, setCreatingNew] = useState<boolean>(false);

  if (creatingNew) {
    return (
      <View style={styles.container}>
        <Spinner loading={loading} />
        <AddTaskView onClose={() => setCreatingNew(false)} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Spinner loading={loading} />
      <Text style={styles.title}>Mis Tareas</Text>
      <ScrollView>
        {/*  array 'tasks' del contexto */}
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>{'¡No tienes tareas aún! Presiona \'+ para empezar.'}</Text>) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask} // Usamos la función del contexto
              onDelete={deleteTask} // Usamos la función del contexto
            />
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.btnNewTask} onPress={() => setCreatingNew(true)}>
        <FontAwesome name="plus-circle" size={50} color="green" />
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 10
  },
  title: {
    fontFamily: 'poppins-bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    textAlign: 'center'
  },
  btnNewTask: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.gray,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});