import { ListenerHandler } from "../listener/listener.interface";
import { IO } from "fp-ts/lib/IO";

export interface ServerIO<T> extends IO<Promise<T>> {}

export interface CreateServerConfig {
  port?: number;
  listener: ListenerHandler;
}
