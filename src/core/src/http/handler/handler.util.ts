import { HttpRequest } from "../../http.interface";
import {
  RouteHandlerFn,
  RouteResponseValidation,
  RouteResponseHeaders,
  ErrorRouteHandlerFn,
} from "../router/router.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { RouteResponse } from "../router/router.interface";
import { defaultHeaders } from "./handler.interface";

export const createRouteHandlerFn = (
  handler: (req: HttpRequest) => RouteResponse | Promise<RouteResponse> | unknown | Promise<unknown>
): RouteHandlerFn => (req: HttpRequest) => TE.tryCatch(async () => await handler(req), E.toError);

export const createErrorRouteHandlerFn = (
  errorHandler: (
    req: HttpRequest,
    error: Error
  ) => RouteResponse | Promise<RouteResponse> | unknown | Promise<unknown>
): ErrorRouteHandlerFn => (req: HttpRequest, error: Error) =>
  TE.tryCatch(async () => await errorHandler(req, error), E.toError);

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
