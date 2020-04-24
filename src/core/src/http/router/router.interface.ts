import {
  RouteResponse,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  HttpMethodType,
} from "../../http.interface";

export interface RouteHandler {
  path: string;
  method: HttpMethod;
  handler: (
    req: HttpRequest,
    res: HttpResponse,
    ...args: unknown[]
  ) => RouteResponse;
}

export interface RegisteredRouteHandler extends RouteHandler {
  pathRegExp: RegExp;
  parameters: string[] | undefined;
}
