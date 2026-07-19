import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { migrateDatabase } from "./src/services/database";
import { useWebSocket } from "./src/services/useWebSocket";

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

function AppNavigator() {
  useWebSocket();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#047857",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Patient App" }} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Tạo hồ sơ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="patient.db" onInit={migrateDatabase}>
        <AppNavigator />
        <StatusBar style="dark" />
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
