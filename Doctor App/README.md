# Doctor App

Flutter application for doctors in the Omni Health platform.

## Stack

Flutter, Dart, Riverpod, Dio, Freezed, json_serializable, GoRouter, Drift,
Flutter Secure Storage, connectivity_plus, Workmanager, WebSocket, Flutter Test
and Integration Test.

## Generate code

```bash
dart run build_runner build --delete-conflicting-outputs
```

## Run

```bash
flutter run --dart-define=API_URL=https://api.example.com \
  --dart-define=WEBSOCKET_URL=wss://api.example.com/ws
```

## Verify

```bash
flutter analyze
flutter test
flutter test integration_test
```
