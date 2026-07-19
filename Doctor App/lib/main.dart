import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:workmanager/workmanager.dart';
import 'src/app.dart';
import 'src/services/background_tasks.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Workmanager().initialize(backgroundDispatcher);
  runApp(const ProviderScope(child: DoctorApp()));
}
