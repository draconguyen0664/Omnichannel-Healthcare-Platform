import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import type { RootStackParamList } from "../../App";
import { authenticatePatient } from "../services/security";
import { useAppStore } from "../stores/useAppStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const connectionStatus = useAppStore((state) => state.connectionStatus);
  const notificationCount = useAppStore((state) => state.notificationCount);
  const { data: serviceStatus = "Đang kiểm tra" } = useQuery({
    queryKey: ["service-status"],
    queryFn: async () => "Dịch vụ sẵn sàng",
  });

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(450)} style={styles.hero}>
        <Text style={styles.eyebrow}>OMNI HEALTH</Text>
        <Text style={styles.title}>Chăm sóc sức khỏe{`\n`}trong tầm tay</Text>
        <Text style={styles.subtitle}>{serviceStatus}</Text>
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kết nối thời gian thực</Text>
        <Text testID="websocket-status" style={styles.status}>
          WebSocket: {connectionStatus} · {notificationCount} thông báo
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.primaryButtonText}>Tạo hồ sơ bệnh nhân</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={authenticatePatient}
      >
        <Text style={styles.secondaryButtonText}>Đăng nhập bằng sinh trắc học</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 24, gap: 16 },
  hero: { marginTop: 28, marginBottom: 16 },
  eyebrow: { color: "#047857", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#10231e", fontSize: 34, fontWeight: "800", lineHeight: 42, marginTop: 10 },
  subtitle: { color: "#64748b", fontSize: 15, marginTop: 12 },
  card: { backgroundColor: "white", borderRadius: 18, padding: 18 },
  cardTitle: { color: "#10231e", fontSize: 17, fontWeight: "700" },
  status: { color: "#64748b", marginTop: 8 },
  primaryButton: { backgroundColor: "#047857", borderRadius: 14, padding: 16, alignItems: "center" },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  secondaryButton: { borderColor: "#047857", borderWidth: 1, borderRadius: 14, padding: 16, alignItems: "center" },
  secondaryButtonText: { color: "#047857", fontSize: 15, fontWeight: "700" },
});
