import {
  RouteResponse,
  HttpResponse,
  HttpRequest,
  ContentType,
  HttpMethodType,
  HttpMethod,
} from "../../http.interface";
import { RouteHandler } from "../router/router.interface";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";
import { errorHandler } from "./handler.error";

export const reqOption = {
  pipe: pipe,
  use: (fn: (req: HttpRequest, res: HttpResponse) => any) => (
    obj: O.Option<RouteHandler> = O.some({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 404,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): O.Option<RouteHandler> =>
    pipe(
      obj,
      O.map(
        (x: RouteHandler) =>
          ({
            path: x.path,
            method: x.method,
            handler: fn,
          } as RouteHandler)
      )
    ),
  matchPath: (path: string) => (
    obj: O.Option<RouteHandler> = O.some({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 404,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): O.Option<RouteHandler> =>
    pipe(
      obj,
      O.map(
        (x: RouteHandler) =>
          ({
            path: path,
            method: x.method,
            handler: x.handler,
          } as RouteHandler)
      )
    ),
  matchMethod: (method: HttpMethod) => (
    obj: O.Option<RouteHandler> = O.some({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 200,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): O.Option<RouteHandler> =>
    pipe(
      obj,
      O.map(
        (x: RouteHandler) =>
          ({
            path: x.path,
            method: method,
            handler: x.handler,
          } as RouteHandler)
      )
    ),
};

/*console.log(
  reqOption.pipe(
    reqOption.matchPath("/mate")(),
    reqOption.matchMethod("POST"),
    reqOption.use((req, res) => "It works"),
    O.getOrElse(() => ({
      path: "",
      method: "*",
      handler: errorHandler("Error in my piped route"),
    }))
  )
);

console.log(
  reqOption.pipe(
    flow(
      reqOption.matchPath("/mate"),
      reqOption.matchMethod("POST"),
      reqOption.use((req, res) => "It works"),
      O.getOrElse(() => ({
        path: "",
        method: "*",
        handler: errorHandler("Error in my piped route"),
      }))
    )()
  )
);*/
