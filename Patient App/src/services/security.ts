import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync("access-token", token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function authenticatePatient() {
  const available = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!available || !enrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Xác thực để mở hồ sơ sức khỏe",
    cancelLabel: "Hủy",
  });
  return result.success;
}
