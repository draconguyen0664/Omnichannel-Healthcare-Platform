import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final realtime = ref.watch(realtimeProvider);
    final connectivity = ref.watch(connectivityProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Doctor App')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Tổng quan bác sĩ', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(connectivity.when(
            data: (value) => value.contains(ConnectivityResult.none) ? 'Ngoại tuyến' : 'Đang trực tuyến',
            loading: () => 'Đang kiểm tra kết nối',
            error: (_, __) => 'Không xác định kết nối',
          )),
          const SizedBox(height: 24),
          Card(
            child: ListTile(
              leading: const Icon(Icons.monitor_heart_outlined),
              title: const Text('WebSocket'),
              subtitle: Text('${realtime.status} · ${realtime.messageCount} cập nhật'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: Icon(Icons.calendar_today_outlined),
              title: Text('Lịch khám hôm nay'),
              trailing: Text('12'),
            ),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () => context.go('/patient'),
            icon: const Icon(Icons.person_add_alt_1),
            label: const Text('Thêm ghi chú bệnh nhân'),
          ),
        ],
      ),
    );
  }
}
