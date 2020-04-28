import { HttpRequest, HttpResponse, ContentType } from "../../http.interface";
import { RouteHandlerFn, RouteResponseValidation, RouteResponseHeaders } from "../router/router.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { RouteResponse } from "../router/router.interface";

export const createRouteHandlerFn = (
  handler: (
    req: HttpRequest,
    res: HttpResponse,
    error?: Error
  ) => RouteResponse | Promise<RouteResponse> | unknown | Promise<unknown>
): RouteHandlerFn => (req: HttpRequest, res: HttpResponse, error?: Error) =>
  TE.tryCatch(async () => await handler(req, res, error), E.toError);

export const isRouteResponse = (handlerResult: RouteResponse | any): boolean =>
  E.isRight(RouteResponseValidation.decode(handlerResult));

export const toRouteResponse = (
  response: unknown,
  status?: number,
  headers?: RouteResponseHeaders
): RouteResponse => ({
  response,
  status: status ? status : 200,
  headers: headers ? { ...defaultHeaders, ...headers } : defaultHeaders,
});

export const defaultHeaders = { "Content-Type": ContentType.APPLICATION_JSON };
