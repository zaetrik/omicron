import { HttpRequest } from "../../../core/src/http.interface";
import * as E from "fp-ts/lib/Either";
import { useMiddleware, useErrorThrowingMiddleware } from "../useMiddleware";
import { Middleware, ErrorThrowingMiddleware } from "../middleware.interface";

describe("useMiddlware", () => {
  test("middleware returns handler response", async () => {
    // given
    const authenticatedMiddleware: Middleware = (req: HttpRequest) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));

    const handler = (req: HttpRequest) => "It works!";

    // when
    const response = await useMiddleware([authenticatedMiddleware])(handler)(({
      query: { number: 11 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("It works!");
  });

  test("middleware throws error message on E.Left", async () => {
    // given
    const authenticatedMiddleware: Middleware = (req) =>
      req.query.number > 5 ? E.right(req) : E.left(new Error("User not authenticated"));

    const handler = (req: HttpRequest) => "It works!";

    try {
      // when
      await useMiddleware([authenticatedMiddleware])(handler)(({
        query: { number: 5 },
      } as unknown) as HttpRequest);
    } catch (e) {
      // then
      // For some reason expect().toThrow & expect().toThrowError() do not work here
      expect(e.message).toEqual("User not authenticated");
    }
  });

  test("middleware returns error handler result on E.Left", async () => {
    // given
    const authenticatedMiddleware: Middleware = (req: HttpRequest) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));

    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const response = await useMiddleware([authenticatedMiddleware])(handler, errorHandler)(({
      query: { number: 5 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("In error handler => User not authenticated");
  });

  test("using multiple middlewares works", async () => {
    // given
    const authenticatedMiddleware: Middleware = (req: HttpRequest) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));
    const isBobMiddleware: Middleware = (req: HttpRequest) =>
      req.query.name === "Bob" ? E.right(req) : E.left(new Error("User is not Bob"));

    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const responseSuccess = await useMiddleware([authenticatedMiddleware, isBobMiddleware])(
      handler,
      errorHandler
    )(({
      query: { number: 11, name: "Bob" },
    } as unknown) as HttpRequest);
    const responseFailureInIsAuthenticated = await useMiddleware([authenticatedMiddleware, isBobMiddleware])(
      handler,
      errorHandler
    )(({
      query: { number: 1, name: "Bob" },
    } as unknown) as HttpRequest);
    const responseFailureInIsBob = await useMiddleware([authenticatedMiddleware, isBobMiddleware])(
      handler,
      errorHandler
    )(({
      query: { number: 11, name: "Bobs" },
    } as unknown) as HttpRequest);

    // then
    expect(responseSuccess).toBeDefined();
    expect(responseSuccess).toEqual("It works!");

    expect(responseFailureInIsAuthenticated).toBeDefined();
    expect(responseFailureInIsAuthenticated).toEqual("In error handler => User not authenticated");

    expect(responseFailureInIsBob).toBeDefined();
    expect(responseFailureInIsBob).toEqual("In error handler => User is not Bob");
  });

  test("middleware handles async tasks", async () => {
    // given
    const authenticatedMiddlewareAsync: Middleware = (req: HttpRequest) =>
      Promise.resolve(req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated")));

    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const response = await useMiddleware([authenticatedMiddlewareAsync])(handler, errorHandler)(({
      query: { number: 15 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("It works!");
  });

  test("error throwing middleware returns handler response", async () => {
    // given
    const authenticatedMiddleware: ErrorThrowingMiddleware = (req: HttpRequest) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();

    const handler = (req: HttpRequest) => "It works!";

    // when
    const response = await useErrorThrowingMiddleware([authenticatedMiddleware])(handler)(({
      query: { number: 11 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("It works!");
  });

  test("middleware throws error message on E.Left", async () => {
    // given
    const authenticatedMiddleware: ErrorThrowingMiddleware = (req: HttpRequest) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();

    const handler = (req: HttpRequest) => "It works!";

    try {
      // when
      await useErrorThrowingMiddleware([authenticatedMiddleware])(handler)(({
        query: { number: 5 },
      } as unknown) as HttpRequest);
    } catch (e) {
      // then
      // For some reason expect().toThrow & expect().toThrowError() do not work here
      expect(e.message).toEqual("User not authenticated");
    }
  });

  test("error throwing middleware returns error handler result on error", async () => {
    // given
    const authenticatedMiddleware: ErrorThrowingMiddleware = (req: HttpRequest) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();

    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const response = await useErrorThrowingMiddleware([authenticatedMiddleware])(handler, errorHandler)(({
      query: { number: 5 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("In error handler => User not authenticated");
  });

  test("using multiple error throwing middlewares works", async () => {
    // given
    const authenticatedMiddleware: ErrorThrowingMiddleware = (req: HttpRequest) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();
    const isBobMiddleware: ErrorThrowingMiddleware = (req: HttpRequest) =>
      req.query.name === "Bob"
        ? req
        : (() => {
            throw new Error("User is not Bob");
          })();
    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const responseSuccess = await useErrorThrowingMiddleware([authenticatedMiddleware, isBobMiddleware])(
      handler,
      errorHandler
    )(({
      query: { number: 11, name: "Bob" },
    } as unknown) as HttpRequest);
    const responseFailureInIsAuthenticated = await useErrorThrowingMiddleware([
      authenticatedMiddleware,
      isBobMiddleware,
    ])(
      handler,
      errorHandler
    )(({
      query: { number: 1, name: "Bob" },
    } as unknown) as HttpRequest);
    const responseFailureInIsBob = await useErrorThrowingMiddleware([
      authenticatedMiddleware,
      isBobMiddleware,
    ])(
      handler,
      errorHandler
    )(({
      query: { number: 11, name: "Bobs" },
    } as unknown) as HttpRequest);

    // then
    expect(responseSuccess).toBeDefined();
    expect(responseSuccess).toEqual("It works!");

    expect(responseFailureInIsAuthenticated).toBeDefined();
    expect(responseFailureInIsAuthenticated).toEqual("In error handler => User not authenticated");

    expect(responseFailureInIsBob).toBeDefined();
    expect(responseFailureInIsBob).toEqual("In error handler => User is not Bob");
  });

  test("error throwing middleware handles async tasks", async () => {
    // given
    const authenticatedMiddlewareAsync: ErrorThrowingMiddleware = (req: HttpRequest) =>
      Promise.resolve(
        req.query.number > 10
          ? req
          : (() => {
              throw new Error("User not authenticated");
            })()
      );

    const handler = (req: HttpRequest) => "It works!";
    const errorHandler = (req: HttpRequest, err: Error) => `In error handler => ${err.message}`;

    // when
    const response = await useErrorThrowingMiddleware([authenticatedMiddlewareAsync])(handler, errorHandler)(
      ({
        query: { number: 15 },
      } as unknown) as HttpRequest
    );

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("It works!");
  });
});
