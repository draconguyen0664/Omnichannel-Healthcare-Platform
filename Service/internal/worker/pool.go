package worker

import (
	"context"
	"sync"
)

type Job func(context.Context) error

type Pool struct {
	jobs chan Job
	wg   sync.WaitGroup
}

func New(size, queueSize int) *Pool {
	pool := &Pool{jobs: make(chan Job, queueSize)}
	pool.wg.Add(size)
	for range size {
		go func() {
			defer pool.wg.Done()
			for job := range pool.jobs { _ = job(context.Background()) }
		}()
	}
	return pool
}

func (p *Pool) Submit(job Job) { p.jobs <- job }
func (p *Pool) Close()         { close(p.jobs); p.wg.Wait() }
