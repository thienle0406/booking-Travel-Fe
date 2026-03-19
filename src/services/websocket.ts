// src/services/websocket.ts
// WebSocket service dung STOMP + SockJS de nhan thong bao real-time tu BE
import { Client } from '@stomp/stompjs';

export interface WsNotification {
    type: string;       // NEW_BOOKING, BOOKING_CONFIRMED, DRIVER_ASSIGNED, BOOKING_CANCELLED, BOOKING_COMPLETED
    title: string;
    message: string;
    bookingId: string;
    targetRole: string; // ADMIN, DRIVER, USER
    targetId: string | null;
    timestamp: number;
}

type NotificationCallback = (notification: WsNotification) => void;

class WebSocketService {
    private client: Client | null = null;
    private callbacks: NotificationCallback[] = [];
    private connected = false;

    /**
     * Ket noi WebSocket khi user dang nhap
     * @param userId - ID cua user hien tai
     * @param role - ADMIN hoac USER
     */
    connect(userId: string, role: string) {
        if (this.connected) return;

        const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8081') + '/ws';

        this.client = new Client({
            brokerURL: undefined, // Khong dung native WebSocket
            webSocketFactory: () => {
                // SockJS fallback
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const SockJS = (window as any).SockJS;
                if (SockJS) return new SockJS(wsUrl);
                // Fallback native WebSocket
                return new WebSocket(wsUrl.replace('http', 'ws'));
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                console.log('[WS] Connected!');
                this.connected = true;

                // Admin subscribe kenh admin
                if (role === 'ADMIN') {
                    this.client?.subscribe('/topic/admin/notifications', (msg) => {
                        const notification: WsNotification = JSON.parse(msg.body);
                        this.fireCallbacks(notification);
                    });
                }

                // Moi user subscribe kenh ca nhan
                this.client?.subscribe(`/topic/user/${userId}`, (msg) => {
                    const notification: WsNotification = JSON.parse(msg.body);
                    this.fireCallbacks(notification);
                });
            },

            onDisconnect: () => {
                console.log('[WS] Disconnected');
                this.connected = false;
            },

            onStompError: (frame) => {
                console.error('[WS] STOMP error:', frame.headers['message']);
            },
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connected = false;
        }
    }

    /**
     * Dang ky callback khi nhan thong bao moi
     * Tra ve ham unsubscribe
     */
    onNotification(callback: NotificationCallback): () => void {
        this.callbacks.push(callback);
        return () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        };
    }

    private fireCallbacks(notification: WsNotification) {
        this.callbacks.forEach(cb => cb(notification));
    }

    isConnected() {
        return this.connected;
    }
}

// Singleton instance
export const wsService = new WebSocketService();
