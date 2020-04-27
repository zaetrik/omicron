import { IncomingMessage, OutgoingMessage } from "http";
import { RouteHandler } from "../router/router.interface";

export interface HttpListenerConfig {
  routes: RouteHandler[];
}

export interface HttpListener {
  (req: IncomingMessage, res: OutgoingMessage): void;
}

export interface ListenerConfig {
  routes: RouteHandler[];
}

export type ListenerHandler = (...args: any[]) => void;
