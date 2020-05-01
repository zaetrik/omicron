import { HttpRequest } from "../../core/src/http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { Middleware, ErrorThrowingMiddleware } from "./middleware.interface";

export const useMiddleware = (middlewares: Middleware[]) => (
  handler: (req: HttpRequest | unknown) => unknown | Promise<unknown>,
  errorHandler?: (req: HttpRequest | unknown, error: Error) => unknown | Promise<unknown>
) => async (req: HttpRequest) =>
  pipe(
    await middlewares.reduce(
      async (prevResultFromMiddleware, middleware) =>
        await pipe(
          await prevResultFromMiddleware,
          // The Promise<E.Either<Error, HttpRequest | unknown>> return type from the type Middleware type causes a compiler error
          // @TODO fix this issue
          E.chain(middleware as (req: HttpRequest) => E.Either<Error, HttpRequest | unknown>)
        ),
      Promise.resolve(E.right(req)) as Promise<E.Either<Error, HttpRequest | unknown>>
    ),
    E.fold(
      async (err) =>
        errorHandler
          ? await errorHandler(req, err)
          : (() => {
              throw err;
            })(),
      async (resultFromMiddleware) => await handler(resultFromMiddleware)
    )
  );

export const useErrorThrowingMiddleware = (middlewares: ErrorThrowingMiddleware[]) => (
  handler: (req: HttpRequest | unknown) => unknown | Promise<unknown>,
  errorHandler?: (req: HttpRequest | unknown, error: Error) => unknown | Promise<unknown>
) => (req: HttpRequest) =>
  pipe(
    middlewares.reduce(
      (prevResultFromMiddleware: TE.TaskEither<Error, HttpRequest | unknown>, middleware) =>
        TE.chain((res) => TE.tryCatch(async () => await middleware(res as HttpRequest), E.toError))(
          prevResultFromMiddleware
        ),
      TE.tryCatch(() => Promise.resolve(req), E.toError) as TE.TaskEither<Error, HttpRequest | unknown>
    ),
    TE.fold(
      (err) =>
        T.task.of(
          errorHandler
            ? errorHandler(req, err)
            : (() => {
                throw err;
              })()
        ),
      (resultFromMiddleware) => T.task.of(handler(resultFromMiddleware))
    )
  )();

// Example middleware => const authenticated: E.Left<Error> | E.Right<any> = (req: HttpRequest) => Math.random() > 0.5 ? E.right(req) : E.left(new Error("User not authenticated"));
