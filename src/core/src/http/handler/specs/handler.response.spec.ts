import { HttpResponse, HttpRequest, RouteResponse } from "../../../http.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { handleResponse } from "../handler.response";
import { RouteHandler } from "../../router/router.interface";
const MockReq = require("mock-req");
const MockRes = require("mock-res");

const getRouteHandler = (
  handler: (req: HttpRequest, res: HttpResponse, err?: Error) => RouteResponse
): RouteHandler => ({
  path: "/",
  method: "GET",
  handler: (req: HttpRequest, res: HttpResponse) =>
    TE.tryCatch(async (): Promise<RouteResponse> => handler(req, res), E.toError),
  errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
    TE.tryCatch(async (): Promise<RouteResponse> => handler(req, res, err), E.toError),
});

describe("Handle response", () => {
  test("handles response properly", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, err?: Error) =>
      ({
        response: "data",
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
    const handler = (req: HttpRequest, res: HttpResponse, err?: Error) => {
      throw new Error("My Error");
    };
    const errorHandler = (req: HttpRequest, res: HttpResponse, err?: Error) =>
      ({ response: err.message, status: 500 } as RouteResponse);

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
    const handler = (req: HttpRequest, res: HttpResponse, err?: Error) => {
      throw new Error("My Error");
    };
    const errorHandler = (req: HttpRequest, res: HttpResponse, err?: Error) => {
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
