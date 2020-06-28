export interface User {
  name: string;
  socket: Socket;
}

export interface HandshakePayload {
  token: string;
  type: 'FEEDER' | 'CONSUMER';
  name: string;
}

export interface Zone {
  id: string;
  players: Player[];
}

export interface Player {
  name: string;
  x: number;
  y: number;
}