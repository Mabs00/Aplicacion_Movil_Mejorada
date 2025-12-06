import {COLORS} from "@/constants/colors";
import {ActivityIndicator, Modal, StyleSheet, Text, View} from "react-native";

type SpinnerProps = {
  readonly loading: boolean
}

export default function Spinner({loading}: SpinnerProps) {
  return (
    <Modal transparent
      animationType="fade"
      visible={loading}>
      <View style={styles.spinnerContainer} >
        <Text style={styles.text}>Cargando...</Text>
        <ActivityIndicator size="large" color={COLORS.primaryAction} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  text: {
    marginBottom: 10,
    color: COLORS.textPrimary
  }
});