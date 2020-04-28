import { matchRoute } from "../router.matcher";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { HttpRequest, ContentType } from "../../../http.interface";
import { RouteHandler } from "../router.interface";
import { pipe } from "fp-ts/lib/pipeable";
const MockReq = require("mock-req");

describe("Match route", () => {
  const fallbackHandler: RouteHandler = {
    path: "/fallback",
    method: "GET",
    handler: (req: HttpRequest) => TE.tryCatch(async () => "Fallback Handler", E.toError),
    errorHandler: (req: HttpRequest, err: Error) =>
      TE.tryCatch(async () => `An error occured: ${err.message}`, E.toError),
  };

  const routeHandlers: RouteHandler[] = [
    {
      path: "/",
      method: "GET",
      handler: (req: HttpRequest) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
    {
      path: "/name/:name",
      method: "GET",
      handler: (req: HttpRequest) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
            status: 200,
            contentType: ContentType.TEXT_HTML,
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
    {
      path: "/name/:name",
      method: "POST",
      handler: (req: HttpRequest) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
            status: 200,
            contentType: ContentType.TEXT_HTML,
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
  ];

  test("matches route with correct RouteHandler => / route", () => {
    // given
    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    // when
    const matchedRoute = matchRoute(routeHandlers)(req as HttpRequest);

    // then
    expect(matchedRoute).toBeDefined();
    expect(matchedRoute._tag).toEqual("Some");
    expect(
      pipe(
        matchedRoute,
        O.getOrElse(() => fallbackHandler)
      ).path
    ).toEqual("/");
  });

  test("matches route with correct RouteHandler => GET /name/:name route", () => {
    // given
    const req = new MockReq({ method: "GET", url: "/name/bob" });
    req.end();

    // when
    const matchedRoute = matchRoute(routeHandlers)(req as HttpRequest);

    // then
    expect(matchedRoute).toBeDefined();
    expect(matchedRoute._tag).toEqual("Some");
    expect(
      pipe(
        matchedRoute,
        O.getOrElse(() => fallbackHandler)
      ).path
    ).toEqual("/name/:name");
    expect(
      pipe(
        matchedRoute,
        O.getOrElse(() => fallbackHandler)
      ).method
    ).toEqual("GET");
  });

  test("matches route with correct RouteHandler => POST /name/:name route", () => {
    // given
    const req = new MockReq({ method: "POST", url: "/name/bob" });
    req.end();

    // when
    const matchedRoute = matchRoute(routeHandlers)(req as HttpRequest);

    // then
    expect(matchedRoute).toBeDefined();
    expect(matchedRoute._tag).toEqual("Some");
    expect(
      pipe(
        matchedRoute,
        O.getOrElse(() => fallbackHandler)
      ).path
    ).toEqual("/name/:name");
    expect(
      pipe(
        matchedRoute,
        O.getOrElse(() => fallbackHandler)
      ).method
    ).toEqual("POST");
  });

  test("matches NO route and returns None => POST / route", () => {
    // given
    const req = new MockReq({ method: "POST", url: "/" });
    req.end();

    // when
    const matchedRoute = matchRoute(routeHandlers)(req as HttpRequest);

    // then
    expect(matchedRoute).toBeDefined();
    expect(matchedRoute._tag).toEqual("None");
  });
});
