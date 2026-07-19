import 'package:go_router/go_router.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/patients/patient_screen.dart';

final appRouter = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => const DashboardScreen()),
    GoRoute(
      path: '/patient',
      builder: (context, state) => const PatientScreen(),
    ),
  ],
);
