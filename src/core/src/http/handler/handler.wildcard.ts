import {
  RouteResponse,
  HttpResponse,
  HttpRequest,
  ContentType,
} from "../../http.interface";
import { RouteHandler } from "../router/router.interface";

export const all = (
  path: string,
  handler: (req: HttpRequest, res: HttpResponse, ...args: unknown[]) => unknown,
  contentType?: ContentType,
  status?: number
): RouteHandler => ({
  path: path,
  method: "*",
  handler: (req: HttpRequest, res: HttpResponse): RouteResponse => {
    return {
      status: status || 200,
      response: handler(req, res) || "",
      contentType: contentType || ContentType.APPLICATION_JSON,
    };
  },
});
