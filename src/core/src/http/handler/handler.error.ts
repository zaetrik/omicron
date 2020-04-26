import {
  RouteResponse,
  ContentType,
  HttpRequest,
  HttpResponse,
} from "../../http.interface";
import { RouteHandlerFn } from "../router/router.interface";
import { createRouteHandlerFn } from "./handler.util";
import { flow } from "fp-ts/lib/function";

export const errorHandler = (err: string): RouteHandlerFn =>
  flow(
    () => createRouteHandlerFn(defaultErrorHandler(err)),
    () => createRouteHandlerFn(defaultErrorHandler(err))
  )();

export const defaultErrorHandler = (err: string) => (
  req: HttpRequest,
  res: HttpResponse
): RouteResponse => ({
  status: 500,
  response: `<h1>${err}</h1>`,
  contentType: ContentType.TEXT_HTML,
});
