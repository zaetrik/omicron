import {
  HttpMethod,
  HttpRequest,
  HttpResponse,
  RouteResponse,
} from "../../http.interface";
import { createRouteHandlerFn } from "./handler.util";
import { RouteHandler } from "../router/router.interface";

export const r = (path: string) => (method: HttpMethod) => (
  handler: (
    req: HttpRequest,
    res: HttpResponse
  ) => RouteResponse | Promise<RouteResponse>
) => (
  errorHandler: (
    req: HttpRequest,
    res: HttpResponse,
    error: Error
  ) => RouteResponse | Promise<RouteResponse>
): RouteHandler => ({
  path,
  method,
  handler: createRouteHandlerFn(handler),
  errorHandler: createRouteHandlerFn(errorHandler),
});
