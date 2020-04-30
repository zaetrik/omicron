import { HttpMethod, HttpRequest } from "../../http.interface";
import { createRouteHandlerFn, createErrorRouteHandlerFn } from "./handler.util";
import { RouteHandler } from "../router/router.interface";

export const r = (path: string) => (method: HttpMethod) => (handler: (req: HttpRequest) => unknown) => (
  errorHandler: (req: HttpRequest, error: Error) => unknown
): RouteHandler => ({
  path,
  method,
  handler: createRouteHandlerFn(handler),
  errorHandler: createErrorRouteHandlerFn(errorHandler),
});
