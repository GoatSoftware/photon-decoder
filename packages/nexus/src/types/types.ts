export interface User {
  name: string;
  socket: Socket;
}

export interface HandshakePayload {
  token: string;
  type: 'FEEDER' | 'CONSUMER';
  name: string;
}