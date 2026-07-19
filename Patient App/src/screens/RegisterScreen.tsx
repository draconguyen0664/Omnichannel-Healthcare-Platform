import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { patientSchema, type PatientInput } from "../schemas/patient";

export function RegisterScreen() {
  const database = useSQLiteContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientInput>({ resolver: zodResolver(patientSchema) });

  const submit = async (values: PatientInput) => {
    await database.runAsync(
      "INSERT INTO patient_profile (full_name, email, created_at) VALUES (?, ?, ?)",
      values.fullName,
      values.email,
      new Date().toISOString(),
    );
    reset();
    Alert.alert("Thành công", "Hồ sơ đã được lưu an toàn trên thiết bị.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin bệnh nhân</Text>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            accessibilityLabel="Họ và tên"
            style={styles.input}
            placeholder="Nguyễn Văn An"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            accessibilityLabel="Email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="an@example.com"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={handleSubmit(submit)}
      >
        <Text style={styles.buttonText}>Lưu hồ sơ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 24, gap: 12 },
  heading: { color: "#10231e", fontSize: 24, fontWeight: "800", marginVertical: 16 },
  input: { backgroundColor: "white", borderColor: "#cbd5e1", borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  error: { color: "#dc2626", fontSize: 13 },
  button: { backgroundColor: "#047857", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});
