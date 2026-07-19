package config

import "testing"

func TestLoadDefaults(t *testing.T) {
	t.Setenv("WORKER_COUNT", "")
	cfg := Load()
	if cfg.WorkerCount != 4 { t.Fatalf("expected 4 workers, got %d", cfg.WorkerCount) }
	if cfg.HTTPAddr != ":8090" { t.Fatalf("unexpected HTTP address: %s", cfg.HTTPAddr) }
}
