import { HttpRequest } from "../../core/src/http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import { Middleware } from "./middleware.interface";

export const useMiddleware = (middleware: Middleware) => (
  handler: (req: HttpRequest | unknown) => unknown,
  errorHandler?: (req: HttpRequest | unknown, error: Error) => unknown
) => (req: HttpRequest) =>
  pipe(
    middleware(req),
    E.fold(
      (err) =>
        errorHandler
          ? errorHandler(req, err)
          : (() => {
              throw err;
            })(),
      (resultFromMiddleware) => handler(resultFromMiddleware)
    )
  );

// Example middleware => const authenticated: E.Left<Error> | E.Right<any> = (req: HttpRequest) => Math.random() > 0.5 ? E.right(req) : E.left(new Error("User not authenticated"));
