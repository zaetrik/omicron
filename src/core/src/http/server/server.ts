import http from "http";
import { HttpServer } from "../../http.interface";
import { ServerIO, CreateServerConfig } from "./server.interface";

export const createServer = async (config: CreateServerConfig) => {
  const { port = 7777, listener } = config;

  const server: HttpServer = http.createServer();

  const listen: ServerIO<HttpServer> = () =>
    new Promise((resolve, reject) => {
      const runningServer: HttpServer = server.listen(port);

      runningServer.on("request", listener);
      runningServer.on("close", runningServer.removeAllListeners);
      runningServer.on("error", reject);
      runningServer.on("listening", () => resolve(runningServer));
    });

  return listen;
};
