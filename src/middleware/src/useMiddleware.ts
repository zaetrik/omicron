import { HttpRequest } from "../../core/src/http.interface";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
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
) => async (req: HttpRequest) =>
  pipe(
    await middlewares.reduce(
      async (prevResultFromMiddleware, middleware) =>
        await pipe(
          await prevResultFromMiddleware,
          E.chain(
            (unwrappedPreviousResult) =>
              (TE.tryCatch(
                async () => await middleware(unwrappedPreviousResult as HttpRequest),
                E.toError
                // The Promise<E.Either<Error, HttpRequest | unknown>> return type from the type Middleware type causes a compiler error
                // @TODO fix this issue
              )() as unknown) as E.Either<Error, unknown | HttpRequest>
          )
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

// Example middleware => const authenticated: E.Left<Error> | E.Right<any> = (req: HttpRequest) => Math.random() > 0.5 ? E.right(req) : E.left(new Error("User not authenticated"));
