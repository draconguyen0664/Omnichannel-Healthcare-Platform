import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers.dart';

class PatientScreen extends ConsumerStatefulWidget {
  const PatientScreen({super.key});

  @override
  ConsumerState<PatientScreen> createState() => _PatientScreenState();
}

class _PatientScreenState extends ConsumerState<PatientScreen> {
  final controller = TextEditingController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> save() async {
    final name = controller.text.trim();
    if (name.length < 2) return;
    await ref.read(databaseProvider).addConsultation(name);
    if (mounted) {
      controller.clear();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã lưu vào Drift')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ghi chú bệnh nhân')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              key: const Key('patient-name'),
              controller: controller,
              decoration: const InputDecoration(labelText: 'Tên bệnh nhân', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: FilledButton(onPressed: save, child: const Text('Lưu ghi chú')),
            ),
          ],
        ),
      ),
    );
  }
}
