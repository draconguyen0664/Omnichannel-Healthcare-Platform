# Patient App

Ứng dụng bệnh nhân dùng Expo, React Native và TypeScript.

## Chạy ứng dụng

```bash
npm install
npm run start:dev-client
```

Các module Firebase Messaging, biometrics và SecureStore cần Development Build (`npx expo run:android` hoặc EAS Build), không chạy đầy đủ trong Expo Go.

Sao chép `.env.example` thành `.env.local` và cập nhật API/WebSocket URL.

## Firebase Cloud Messaging

Thêm file Firebase thật trước khi tạo native build:

- Android: `google-services.json`
- iOS: `GoogleService-Info.plist`

Sau đó khai báo `android.googleServicesFile` và `ios.googleServicesFile` trong `app.json`. Không commit các file chứa thông tin Firebase nhạy cảm.

## E2E với Maestro

Sau khi cài Maestro và mở emulator có app:

```bash
maestro test .maestro/home.yaml
```
