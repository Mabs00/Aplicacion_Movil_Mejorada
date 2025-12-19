import {LocationData, Task} from "@/constants/types";
import {useAuth} from "@/context/auth-context";
import {useTasks} from "@/context/task-context";
import getImageUploadService from "@/services/image-upload-service";
import {launchCameraAsync, requestCameraPermissionsAsync} from "expo-image-picker";
import {getCurrentPositionAsync, requestForegroundPermissionsAsync} from 'expo-location';
import {useState} from "react";
import {Alert} from "react-native";
import uuid from 'react-native-uuid';

export interface AddTaskProps {
  onClose: () => void;
}

export function useTaskAdd({onClose}: AddTaskProps) {

  const {addTask} = useTasks();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const {user} = useAuth();

  const handleTakePhoto = async () => {
    // 1. Pedir permiso
    const {status: cameraStatus} = await requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permiso Requerido', 'Necesitamos permiso de la cámara para tomar fotos.');
      return;
    }

    let result = await launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.5,
      allowsEditing: false,
      exif: false
    });
    setLoading(true);

    if (!result.canceled && result.assets.length > 0) {
      const imageUploadService = getImageUploadService({token: user!.token});
      const formData = new FormData();
      const uriParts = result.assets[0].uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: result.assets[0].uri,
        name: `photo.${ fileType }`,
        type: `image/${ fileType }`,
      } as any);

      const uploadedImageUrl = await imageUploadService.uploadImage(formData);
      setPhotoUri(uploadedImageUrl);
    }
    setLoading(false);
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    // 1. Pedir permiso
    const {status} = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Localización Requerida', 'Se requiere acceso a la localización.');
      return null;
    }

    // 2. Obtener Coordenadas
    try {
      let loc = await getCurrentPositionAsync({});
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
        photoUri: photoUri,
        location: currentLoc,
        createdAt: Date.now(),
      };

      addTask(newTodo);
      setTitle('');
      setPhotoUri(null);
      setLocation(null);
      onClose();

    } catch (error) {
      Alert.alert('Error al crear tarea', 'Ocurrió un error inesperado al guardar.');
      console.error("Error en handleAdd:", error);
    }
  }
  return {
    loading,
    title,
    setTitle,
    photoUri,
    handleTakePhoto,
    handleAdd
  };
}