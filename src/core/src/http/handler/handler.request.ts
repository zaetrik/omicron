import {
  HttpMethod,
  HttpRequest,
  HttpResponse,
  RouteResponse,
  ContentType,
} from "../../http.interface";
import { createRouteHandlerFn } from "./handler.util";
import { RouteHandler } from "../router/router.interface";

export const r = (path: string) => (method: HttpMethod) => (
  handler: (req: HttpRequest, res: HttpResponse) => unknown,
  status?: number,
  contentType?: ContentType
) => (
  errorHandler: (req: HttpRequest, res: HttpResponse, error: Error) => unknown,
  errorStatus?: number,
  errorContentType?: ContentType
): RouteHandler => ({
  path,
  method,
  handler: createRouteHandlerFn(
    async (req: HttpRequest, res: HttpResponse): Promise<RouteResponse> => ({
      status: status || 200,
      response: await handler(req, res),
      contentType: contentType || ContentType.APPLICATION_JSON,
    })
  ),
  errorHandler: createRouteHandlerFn(
    async (
      req: HttpRequest,
      res: HttpResponse,
      error: Error
    ): Promise<RouteResponse> => ({
      status: errorStatus || 500,
      response: await errorHandler(req, res, error),
      contentType: errorContentType,
    })
  ),
});
