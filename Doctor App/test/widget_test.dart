import 'package:doctor_app/src/app.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('renders the doctor dashboard', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: DoctorApp()));
    await tester.pump();
    expect(find.text('Tổng quan bác sĩ'), findsOneWidget);
    expect(find.text('Thêm ghi chú bệnh nhân'), findsOneWidget);
  });
}
