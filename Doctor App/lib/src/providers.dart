import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/app_database.dart';
import 'services/realtime_service.dart';

final dioProvider = Provider<Dio>((ref) {
  return Dio(BaseOptions(
    baseUrl: const String.fromEnvironment(
      'API_URL',
      defaultValue: 'https://api.example.com',
    ),
    connectTimeout: const Duration(seconds: 10),
  ));
});

final databaseProvider = Provider<AppDatabase>((ref) {
  final database = AppDatabase();
  ref.onDispose(database.close);
  return database;
});

final connectivityProvider = StreamProvider<List<ConnectivityResult>>((ref) {
  return Connectivity().onConnectivityChanged;
});

final realtimeProvider = StateNotifierProvider<RealtimeNotifier, RealtimeState>(
  (ref) {
    final notifier = RealtimeNotifier(
      const String.fromEnvironment('WEBSOCKET_URL'),
    );
    ref.onDispose(notifier.dispose);
    return notifier;
  },
);
