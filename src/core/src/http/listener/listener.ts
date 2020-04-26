import { IncomingMessage, OutgoingMessage } from "http";
import { HttpRequest, HttpResponse } from "../../http.interface";
import { setupRouting } from "../router/router.setup";
import { matchRoute } from "../router/router.matcher";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { errorHandler as defaultErrorHandler } from "../handler/handler.error";
import { handleResponse } from "../handler/handler.response";
import {
  ListenerConfig,
  ListenerHandler,
  HttpListenerConfig,
  HttpListener,
} from "./listener.interface";
import { resolveRequest } from "../router/router.resolver";
import { RouteHandlerFn } from "../router/router.interface";

const createListener = <T extends ListenerConfig, U extends ListenerHandler>(
  config: ListenerConfig
) => {
  const { routes = [] } = config ?? {};

  const routing = setupRouting(routes);
  const routeMatcher = matchRoute(routing);

  const handle = async (req: IncomingMessage, res: OutgoingMessage) => {
    const serverReq = req as HttpRequest;
    const serverRes = res as HttpResponse;

    // Here we try to match our req.url to the correct RouteHandler
    // Then we try to resolve the request by populating the req object with the query, params & body objects
    const { routeHandler, errorHandler, populatedReq } = await pipe(
      routeMatcher(serverReq),
      O.chain((routeHandler) => resolveRequest(serverReq)(routeHandler)),
      O.getOrElse(() =>
        Promise.resolve({
          routeHandler: defaultErrorHandler("No handler found"),
          errorHandler: defaultErrorHandler("No handler found"),
          populatedReq: serverReq as HttpRequest,
        })
      )
    );

    handleResponse(routeHandler)(errorHandler)(populatedReq)(serverRes);
  };

  return handle;
};

export const httpListener = (config?: HttpListenerConfig) =>
  createListener<HttpListenerConfig, HttpListener>(config);
