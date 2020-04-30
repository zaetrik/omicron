import { HttpResponse, HttpRequest } from "../../../http.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { handleResponse } from "../handler.response";
import { RouteHandler, RouteResponse, ErrorRouteHandlerFn } from "../../router/router.interface";
const MockReq = require("mock-req");
const MockRes = require("mock-res");

const getRouteHandler = (handler: (req: HttpRequest, err?: Error) => RouteResponse): RouteHandler => ({
  path: "/",
  method: "GET",
  handler: (req: HttpRequest) => TE.tryCatch(async (): Promise<RouteResponse> => handler(req), E.toError),
  errorHandler: (req: HttpRequest, err: Error) =>
    TE.tryCatch(async (): Promise<RouteResponse> => handler(req, err), E.toError),
});

describe("Handle response", () => {
  test("handles response properly", () => {
    // given
    const handler = (req: HttpRequest, err?: Error) =>
      ({
        response: "data",
        status: 200,
        headers: {},
      } as RouteResponse);

    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    const res = new MockRes(finish);

    // when
    handleResponse(getRouteHandler(handler).handler)(getRouteHandler(handler).errorHandler)(
      req as HttpRequest
    )(res as HttpResponse);

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(200);
      expect(this._getString()).toEqual("data");
    }
  });

  test("executes error handler if error is thrown in handler", () => {
    // given
    const handler = (req: HttpRequest) => {
      throw new Error("My Error");
    };
    const errorHandler = (req: HttpRequest, err: Error) =>
      ({ response: err.message, status: 500, headers: {} } as RouteResponse);

    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    const res = new MockRes(finish);

    // when
    handleResponse(getRouteHandler(handler).handler)(getRouteHandler(errorHandler).errorHandler)(
      req as HttpRequest
    )(res as HttpResponse);

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(500);
      expect(this._getString()).toEqual("My Error");
    }
  });

  test("executes fallback error handler if error is thrown in both handlers", () => {
    // given
    const handler = (req: HttpRequest) => {
      throw new Error("My Error");
    };
    const errorHandler = (req: HttpRequest, err: Error) => {
      throw new Error("Error in error handler");
    };

    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    const res = new MockRes(finish);

    // when
    handleResponse(getRouteHandler(handler).handler)(getRouteHandler(errorHandler).errorHandler)(
      req as HttpRequest
    )(res as HttpResponse);

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(500);
      expect(this._getString()).toEqual("Error in error handler");
    }
  });
});
