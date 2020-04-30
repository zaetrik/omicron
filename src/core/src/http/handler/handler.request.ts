import { HttpMethod, HttpRequest } from "../../http.interface";
import { createRouteHandlerFn, createErrorRouteHandlerFn } from "./handler.util";
import { RouteHandler } from "../router/router.interface";

export const r = (path: string) => (method: HttpMethod) => (
  handler: (req: HttpRequest) => unknown | Promise<unknown>
) => (errorHandler: (req: HttpRequest, error: Error) => unknown | Promise<unknown>): RouteHandler => ({
  path,
  method,
  handler: createRouteHandlerFn(handler),
  errorHandler: createErrorRouteHandlerFn(errorHandler),
});
