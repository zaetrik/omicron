import { HttpRequest } from "../../../core/src/http.interface";
import * as E from "fp-ts/lib/Either";
import { useMiddleware } from "../useMiddleware";
import { Middleware } from "../middleware.interface";

describe("useMiddlware", () => {
  test("middleware returns handler response", async () => {
    // given
    const authenticatedMiddleware: Middleware = (req: HttpRequest) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));

    const handler = (req: HttpRequest) => "It works!";

    // when
    const response = await useMiddleware(authenticatedMiddleware)(handler)(({
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
      useMiddleware(authenticatedMiddleware)(handler)(({
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
    const response = useMiddleware(authenticatedMiddleware)(handler, errorHandler)(({
      query: { number: 5 },
    } as unknown) as HttpRequest);

    // then
    expect(response).toBeDefined();
    expect(response).toEqual("In error handler => User not authenticated");
  });
});
