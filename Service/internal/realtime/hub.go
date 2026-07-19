package realtime

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Hub struct {
	register   chan *client
	unregister chan *client
	broadcast  chan []byte
	clients    map[*client]struct{}
}

type client struct {
	connection *websocket.Conn
	send       chan []byte
}

func NewHub() *Hub {
	return &Hub{
		register: make(chan *client), unregister: make(chan *client),
		broadcast: make(chan []byte, 256), clients: make(map[*client]struct{}),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.clients[c] = struct{}{}
		case c := <-h.unregister:
			if _, ok := h.clients[c]; ok {
				delete(h.clients, c)
				close(c.send)
			}
		case message := <-h.broadcast:
			for c := range h.clients {
				select {
				case c.send <- message:
				default:
					delete(h.clients, c)
					close(c.send)
				}
			}
		}
	}
}

func (h *Hub) Broadcast(message []byte) { h.broadcast <- message }
func (h *Hub) Count() int              { return len(h.clients) }

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (h *Hub) Handle(c *gin.Context) {
	connection, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil { return }
	client := &client{connection: connection, send: make(chan []byte, 32)}
	h.register <- client

	go func() {
		defer connection.Close()
		for message := range client.send {
			_ = connection.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := connection.WriteMessage(websocket.TextMessage, message); err != nil { return }
		}
	}()

	for {
		if _, _, err := connection.ReadMessage(); err != nil {
			h.unregister <- client
			return
		}
	}
}
