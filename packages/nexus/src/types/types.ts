import { Socket } from 'socket.io';

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
  heading: number;
}

export interface PathFindingNode {
  id: string;
  w: number;
  from?: string;
  dir?: string;
}

export type Nodes = Record<string, Node>;

type Node = Record<string, Exit>;

interface Exit {
  w: number,
  dir: string;
}
