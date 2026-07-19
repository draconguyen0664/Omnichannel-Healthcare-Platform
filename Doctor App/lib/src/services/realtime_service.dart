import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class RealtimeState {
  const RealtimeState({this.status = 'Chờ cấu hình', this.messageCount = 0});
  final String status;
  final int messageCount;
}

class RealtimeNotifier extends StateNotifier<RealtimeState> {
  RealtimeNotifier(this.url) : super(const RealtimeState()) {
    if (url.isNotEmpty) _connect();
  }

  final String url;
  WebSocketChannel? _channel;
  Timer? _timer;
  int _attempt = 0;

  void _connect() {
    state = RealtimeState(status: 'Đang kết nối', messageCount: state.messageCount);
    _channel = WebSocketChannel.connect(Uri.parse(url));
    _channel!.stream.listen(
      (_) {
        _attempt = 0;
        state = RealtimeState(
          status: 'Đã kết nối',
          messageCount: state.messageCount + 1,
        );
      },
      onError: (_) => _reconnect(),
      onDone: _reconnect,
    );
  }

  void _reconnect() {
    _timer?.cancel();
    final seconds = (1 << _attempt.clamp(0, 5));
    _attempt++;
    state = RealtimeState(status: 'Đang kết nối lại', messageCount: state.messageCount);
    _timer = Timer(Duration(seconds: seconds), _connect);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _channel?.sink.close();
    super.dispose();
  }
}
