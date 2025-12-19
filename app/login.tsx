import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {COLORS} from "../constants/colors";
import Spinner from "./components/spinner";
import {useLogin} from "./hooks/use-login";

const LoginBackground = require("../assets/svg/login-background.svg").default;


export default function LoginView() {

  const {
    loading,
    email,
    password,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      <Spinner loading={loading} />
      <View style={styles.backgroundContainer}>
        <LoginBackground width="100%" height="100%" preserveAspectRatio="xMinYMin slice" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Hola !</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
        />
        <TextInput
          placeholder="Contraseña"
          keyboardType="default"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={handlePasswordChange}
        />

        <View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable style={({pressed}) => [styles.button, pressed && styles.buttonPressed]} disabled={loading || !email || !password} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  title: {
    fontFamily: 'poppins-bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: 'inter-regular',
    fontSize: 16,
    color: COLORS.textSecondary
  },
  formContainer: {
    width: '90%',
    padding: 20,
    marginBottom: 60,
    elevation: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,

  },
  input: {
    height: 40,
    borderColor: COLORS.divider,
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 9,
    fontFamily: 'inter-regular'
  },
  button: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: COLORS.primaryAction,
    borderRadius: 10,
    elevation: 5
  },
  buttonText: {
    color: COLORS.white,
    padding: 10,
    fontWeight: 'bold'
  },
  buttonPressed: {
    transform: [{scale: 0.90}],
    opacity: 0.8
  },
  errorText: {
    color: 'red',
    marginTop: 10
  }
});