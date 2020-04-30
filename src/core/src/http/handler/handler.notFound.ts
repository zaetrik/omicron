import { ContentType, HttpRequest, HttpStatus } from "../../http.interface";
import { RouteHandlerFn, RouteResponse } from "../router/router.interface";
import { createRouteHandlerFn } from "./handler.util";
import { flow } from "fp-ts/lib/function";

export const notFoundHandler = (): RouteHandlerFn =>
  flow(
    () => createRouteHandlerFn(defaultNotFoundRouteResponse),
    () => createRouteHandlerFn(defaultNotFoundRouteResponse)
  )();

export const defaultNotFoundRouteResponse = (req: HttpRequest): RouteResponse => ({
  status: HttpStatus.NOT_FOUND,
  response: `<h1>Not Found</h1>`,
  headers: { "Content-Type": ContentType.TEXT_HTML },
});
