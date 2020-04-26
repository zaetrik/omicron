import { match } from "path-to-regexp";
import { RouteHandler } from "./router.interface";
import { HttpRequest, HttpMethod } from "../../http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";

export const matchRoute = (routeHandlers: RouteHandler[]) => (
  req: HttpRequest
): O.Option<RouteHandler> => {
  // split at query => path-to-regexp cannot handle it
  const [urlPath, _] = req.url.split("?");
  return pipe(
    O.fromNullable(routeHandlers),
    O.map((handlers) =>
      handlers.filter(
        (handler) =>
          match(handler.path, { decode: decodeURIComponent })(urlPath) &&
          matchMethod(req.method as HttpMethod, handler.method)
      )
    ),
    O.chain((handlers) => (handlers[0]?.handler ? O.some(handlers[0]) : O.none))
  );
};

const matchMethod = (
  reqMethod: HttpMethod,
  handlerMethod: HttpMethod
): boolean => handlerMethod === reqMethod || handlerMethod === "*";
