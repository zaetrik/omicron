import { HttpRequest, HttpResponse, RouteResponse } from "../../http.interface";
import { RouteHandlerFn } from "../router/router.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

export const createRouteHandlerFn = (
  handler: (
    req: HttpRequest,
    res: HttpResponse,
    error?: Error
  ) => RouteResponse | Promise<RouteResponse>
): RouteHandlerFn => (req: HttpRequest, res: HttpResponse, error?: Error) =>
  TE.tryCatch(async () => await handler(req, res, error), E.toError);
