import { RouteHandler, RouteHandlerFn } from "./router.interface";
import { HttpRequest, RequestBody } from "../../http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { getPathParams } from "./router.params";
import { getQuery } from "./router.query";
import { getBody } from "./router.body";

// Here we populate the request object with query, params & body
export const resolveRequest = (req: HttpRequest) => (
  routeHandler: RouteHandler
): O.Option<
  Promise<{
    routeHandler: RouteHandlerFn;
    errorHandler: RouteHandlerFn;
    populatedReq: HttpRequest;
  }>
> => {
  // split at query => path-to-regexp cannot handle it
  const [urlPath, _] = req.url.split("?");

  return pipe(
    O.fromNullable(routeHandler),
    O.map(
      async (handler) =>
        ({
          routeHandler: handler.handler, // Add some null check with Option
          errorHandler: handler.errorHandler,
          populatedReq: {
            ...req,
            params: getPathParams(handler.path, urlPath),
            query: getQuery(req.url),
            body: pipe(
              await getBody(req),
              E.getOrElse((e) => ({} as RequestBody))
            ),
          },
        } as {
          routeHandler: RouteHandlerFn;
          errorHandler: RouteHandlerFn;
          populatedReq: HttpRequest;
        })
    )
  );
};
