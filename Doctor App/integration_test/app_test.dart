import 'package:doctor_app/src/app.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('opens patient note form', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: DoctorApp()));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Thêm ghi chú bệnh nhân'));
    await tester.pumpAndSettle();
    expect(find.text('Ghi chú bệnh nhân'), findsWidgets);
  });
}
