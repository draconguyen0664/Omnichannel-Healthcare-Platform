import 'package:workmanager/workmanager.dart';

const syncTask = 'sync-consultations';

@pragma('vm:entry-point')
void backgroundDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    // The API sync implementation belongs here once authentication is wired.
    return task == syncTask || task.isNotEmpty;
  });
}

Future<void> scheduleConsultationSync() {
  return Workmanager().registerOneOffTask(
    'consultation-sync-once',
    syncTask,
    constraints: Constraints(networkType: NetworkType.connected),
  );
}
