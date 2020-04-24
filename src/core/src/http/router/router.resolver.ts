import { RegisteredRouteHandler } from "./router.interface";
import { HttpRequest, RouteResponse, HttpResponse } from "../../http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import { getPathParams } from "./router.params";
import { getQuery } from "./router.query";

// Here we populate the request object with query, params & body
export const resolveRequest = (req: HttpRequest) => (
  routeHandler: RegisteredRouteHandler
): O.Option<{
  routeHandler: (req: HttpRequest, res: HttpResponse) => RouteResponse;
  populatedReq: HttpRequest;
}> => {
  // split at query => path-to-regexp cannot handle it
  const [urlPath, _] = req.url.split("?");

  return pipe(
    O.fromNullable(routeHandler),
    O.map(
      (handler) =>
        ({
          routeHandler: handler.handler, // Add some null check with Option
          populatedReq: {
            ...req,
            params: getPathParams(handler.path, urlPath),
            query: getQuery(req.url),
            body: {},
          },
        } as {
          routeHandler: (req: HttpRequest, res: HttpResponse) => RouteResponse;
          populatedReq: HttpRequest;
        })
    )
  );
};
