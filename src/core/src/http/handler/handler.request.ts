import { HttpMethod, HttpRequest, HttpResponse, ContentType } from "../../http.interface";
import { createRouteHandlerFn } from "./handler.util";
import { RouteHandler } from "../router/router.interface";

export const r = (path: string) => (method: HttpMethod) => (
  handler: (req: HttpRequest, res: HttpResponse) => unknown
) => (errorHandler: (req: HttpRequest, res: HttpResponse, error: Error) => unknown): RouteHandler => ({
  path,
  method,
  handler: createRouteHandlerFn(handler),
  errorHandler: createRouteHandlerFn(errorHandler),
});
