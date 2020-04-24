import {
  HttpResponse,
  HttpRequest,
  ContentType,
  HttpMethod,
} from "../../http.interface";
import { RouteHandler } from "../router/router.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";
import { errorHandler } from "./handler.error";

export const reqEither = {
  pipe: pipe,
  use: (fn: (req: HttpRequest, res: HttpResponse) => any) => (
    obj: E.Either<Error, RouteHandler> = E.right({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 404,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): E.Either<Error, RouteHandler> =>
    pipe(
      obj,
      E.map(
        (x: RouteHandler) =>
          ({
            path: x.path,
            method: x.method,
            handler: fn,
          } as RouteHandler)
      )
    ),
  matchPath: (path: string) => (
    obj: E.Either<Error, RouteHandler> = E.right({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 404,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): E.Either<Error, RouteHandler> =>
    pipe(
      obj,
      E.map(
        (x: RouteHandler) =>
          ({
            path: path,
            method: x.method,
            handler: x.handler,
          } as RouteHandler)
      )
    ),
  matchMethod: (method: HttpMethod) => (
    obj: E.Either<Error, RouteHandler> = E.right({
      path: "",
      method: "*",
      handler: (req, res) => ({
        status: 200,
        response: "<h1>Default Handler</h1>",
        contentType: ContentType.TEXT_HTML,
      }),
    } as RouteHandler)
  ): E.Either<Error, RouteHandler> =>
    pipe(
      obj,
      E.map(
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
    E.getOrElse(() => ({
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
      E.getOrElse(() => ({
        path: "",
        method: "*",
        handler: errorHandler("Error in my piped route"),
      }))
    )()
  )
);*/
