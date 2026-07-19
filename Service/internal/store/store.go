package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct{ Pool *pgxpool.Pool }

func Open(ctx context.Context, url string) (*Store, error) {
	pool, err := pgxpool.New(ctx, url)
	if err != nil { return nil, err }
	if err := pool.Ping(ctx); err != nil { pool.Close(); return nil, err }
	store := &Store{Pool: pool}
	_, err = pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS realtime_events (
		id BIGSERIAL PRIMARY KEY, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`)
	if err != nil { pool.Close(); return nil, err }
	return store, nil
}

func (s *Store) SaveEvent(ctx context.Context, payload []byte) error {
	_, err := s.Pool.Exec(ctx, "INSERT INTO realtime_events(payload) VALUES($1)", payload)
	return err
}

func (s *Store) DeleteOldEvents(ctx context.Context) error {
	_, err := s.Pool.Exec(ctx, "DELETE FROM realtime_events WHERE created_at < NOW() - INTERVAL '30 days'")
	return err
}
