import {COLORS} from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AddTaskProps, useTaskAdd} from '../hooks/use-task-add';
import Spinner from './spinner';

export default function AddTaskView({onClose}: AddTaskProps) {

  const {
    loading,
    title,
    setTitle,
    photoUri,
    handleTakePhoto,
    handleAdd
  } = useTaskAdd({onClose});

  return (
    <View style={styles.container}>
      <Spinner loading={loading} />
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