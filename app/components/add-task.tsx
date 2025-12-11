import {COLORS} from '@/constants/colors';
import {LocationData, Task} from '@/constants/types';
import {useAuth} from '@/context/auth-context';
import {useTasks} from '@/context/task-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import uuid from 'react-native-uuid';

interface AddTaskProps {
  onClose: () => void;
}

export default function AddTaskView({onClose}: AddTaskProps) {

  // 🚨 OBTENEMOS LA FUNCIÓN DE GUARDADO GLOBAL
  const {addTask} = useTasks();

  // 1. ESTADOS
  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null); // Contendrá la cadena Base64
  const [location, setLocation] = useState<LocationData | null>(null);
  const {user} = useAuth();

  // --- LÓGICA DE CÁMARA (BASE64) ---
  const handleTakePhoto = async () => {
    // 1. Pedir permiso
    const {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permiso Requerido', 'Necesitamos permiso de la cámara para tomar fotos.');
      return;
    }

    // 2. Abrir la Cámara, pidiendo base64
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5, // Calidad media
      base64: true, // 🚨 CLAVE: Obtiene la imagen como string Base64
    });

    // 3. Guardar la cadena Base64 para previsualización
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Se añade el prefijo 'data:' para que el componente <Image> lo interprete
      const base64Image = `data:image/jpeg;base64,${ result.assets[0].base64 }`;
      setPhotoUri(base64Image);
    }
  };

  // --- LÓGICA DE LOCALIZACIÓN ---
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    // 1. Pedir permiso
    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Localización Requerida', 'Se requiere acceso a la localización.');
      return null;
    }

    // 2. Obtener Coordenadas
    try {
      let loc = await Location.getCurrentPositionAsync({});
      const newLocation: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(newLocation);
      return newLocation;
    } catch (error) {
      Alert.alert('Error de Localización', 'No se pudo obtener su ubicación actual.');
      return null;
    }
  };

  // --- LÓGICA DE AGREGAR TAREA (FINAL) ---
  const handleAdd = async () => {
    // 1. Validaciones
    if (!title.trim()) {
      Alert.alert('Error', 'El título de la tarea no puede estar vacío.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Error', 'Debe tomar una fotografía para la tarea.');
      return;
    }

    // 2. Obtener Localización
    const currentLoc = await getCurrentLocation();
    if (!currentLoc) return;

    try {
      // 3. Crear el objeto final de la Tarea COMPLETO
      const newTodo: Task = {
        id: uuid.v4().toString(),
        title: title.trim(),
        completed: false,
        userId: user ? user.id : '',
        photoUri: photoUri, // Cadena Base64
        location: currentLoc,
        createdAt: Date.now(),
      };

      addTask(newTodo);
      // 4. Limpiar y cerrar
      setTitle('');
      setPhotoUri(null);
      setLocation(null);
      onClose();

    } catch (error) {
      Alert.alert('Error al crear tarea', 'Ocurrió un error inesperado al guardar.');
      console.error("Error en handleAdd:", error);
    }
  };

  // --- RENDERIZADO (RETURN) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Nueva Tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva tarea"
        value={title}
        onChangeText={setTitle}
      />

      {/* PHOTO BOX CON PREVISUALIZACIÓN */}
      <View style={styles.photoBox}>
        {photoUri ? (
          <Image
            source={{uri: photoUri}}
            style={styles.photoPreview}
          />
        ) : (
          <View style={styles.placeholder}>
            <FontAwesome name="camera" size={40} color={COLORS.white} />
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>

      {/* BOTÓN TOMAR FOTOGRAFÍA (CONECTADO A handleTakePhoto) */}
      <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
        <FontAwesome name="camera" size={20} color={COLORS.white} />
        <Text style={styles.buttonText}>Tomar Fotografía</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnAddTask} onPress={handleAdd}>
        <FontAwesome name="plus" size={16} color={COLORS.white} />
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnBack} onPress={onClose}>
        <FontAwesome name="arrow-circle-left" size={50} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'poppins-bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20
  },
  btnAddTask: {
    backgroundColor: COLORS.sendAction,
    paddingVertical: 10,
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 2
  },
  btnBack: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primaryAction,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  photoBox: {
    width: '100%',
    height: 180,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.backgroundAccent,
  },
  // ESTILO NUEVO
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 14,
  },
});