package messaging

import (
	"context"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

func New(url string) (*Consumer, error) {
	connection, err := amqp.Dial(url)
	if err != nil { return nil, err }
	channel, err := connection.Channel()
	if err != nil { connection.Close(); return nil, err }
	return &Consumer{connection: connection, channel: channel}, nil
}

func (c *Consumer) Consume(ctx context.Context, queue string, handler func([]byte)) error {
	_, err := c.channel.QueueDeclare(queue, true, false, false, false, nil)
	if err != nil { return err }
	deliveries, err := c.channel.Consume(queue, "realtime-service", false, false, false, false, nil)
	if err != nil { return err }
	go func() {
		for {
			select {
			case <-ctx.Done(): return
			case delivery, ok := <-deliveries:
				if !ok { return }
				handler(delivery.Body)
				_ = delivery.Ack(false)
			}
		}
	}()
	return nil
}

func (c *Consumer) Close() { _ = c.channel.Close(); _ = c.connection.Close() }
