import {useFonts} from "expo-font";
import {SplashScreen, Stack} from "expo-router";
import {useEffect} from "react";
import {AuthProvider} from "../context/auth-context";
// Importamos el TasksProvider
import {TasksProvider} from "../context/task-context";

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, fontError] = useFonts({
    'inter-regular': require('../assets/fonts/inter-regular.ttf'),
    'poppins-bold': require('../assets/fonts/poppins-bold.ttf'),
  });

  useEffect(() => {

    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      { }
      <TasksProvider>
        <Stack>
          <Stack.Screen name="login" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack>
      </TasksProvider>
    </AuthProvider>
  );
}