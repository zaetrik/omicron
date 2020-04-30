import { HttpResponse, HttpRequest } from "../../../http.interface";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { handleResponse, sendResponse, transformResponse } from "../handler.response";
import { RouteHandler, RouteResponse } from "../../router/router.interface";
import { pipe } from "fp-ts/lib/pipeable";
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
    )(res as HttpResponse)();

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(200);
      expect(this._getString()).toEqual("data");
    }
  });

  test("executes error handler if error is thrown in handler (returning RouteResponse from error handler)", () => {
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
    )(res as HttpResponse)();

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(500);
      expect(this._getString()).toEqual("My Error");
    }
  });

  test("executes error handler if error is thrown in handler (NOT returning RouteResponse from error handler)", () => {
    // given
    const handler = (req: HttpRequest) => {
      throw new Error("My Error");
    };
    const errorHandler = (req: HttpRequest, err: Error) => err.message;
    const errorRouteHandler = (req: HttpRequest, err: Error) =>
      // @ts-ignore
      TE.tryCatch(async (): Promise<RouteResponse> => errorHandler(req, err), E.toError);

    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    const res = new MockRes(finish);

    // when
    handleResponse(getRouteHandler(handler).handler)(errorRouteHandler)(req as HttpRequest)(
      res as HttpResponse
    )();

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
    )(res as HttpResponse)();

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(500);
      expect(this._getString()).toEqual("Error in error handler");
    }
  });

  test("sendResponse works properly when RouteResponse is passed in", () => {
    // given
    const res = new MockRes(finish);

    // when
    sendResponse(res)({ status: 200, response: "It works!", headers: {} })();

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(200);
      expect(this._getString()).toEqual("It works!");
    }
  });

  test("sendResponse works properly when RouteResponse is NOT passed in", () => {
    // given
    const res = new MockRes(finish);

    // when
    sendResponse(res)({ response: undefined, status: undefined, headers: undefined } as RouteResponse)();

    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(200);
      expect(this._headers).toEqual({ "content-type": "application/json" });
      expect(this._getString()).toEqual("");
    }
  });

  test("sendResponse sends empty response on parsing error & also throws an error", () => {
    // given
    // Parsing a circular JSON error
    let circularReference = { otherData: 123 };
    // @ts-ignore
    circularReference.myself = circularReference;
    //req.end();
    const res = new MockRes(finish);

    // when
    try {
      sendResponse(res)({ status: 200, response: circularReference, headers: {} })();
    } catch (e) {
      expect(e.message).toContain("Could not parse response:");
    }
    // then
    function finish() {
      // NOTE `this` === `res`

      expect(this.statusCode).toEqual(500);
      expect(this._getString()).toEqual("");
    }
  });

  test("E.Left when trying to transform a circular JSON response to string", () => {
    // given
    // Parsing a circular JSON error
    let circularReference = { otherData: 123 };
    // @ts-ignore
    circularReference.myself = circularReference;

    // when
    const transformedResponse = transformResponse(circularReference);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isLeft(transformedResponse)).toEqual(true);
  });

  test("E.Right when transforming a response to string", () => {
    // given
    const response = { data: "It works!" };

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual(JSON.stringify({ data: "It works!" }));
  });

  test("E.Right when transforming a number response", () => {
    // given
    const response = 1000;

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("1000");
  });

  test("E.Right when transforming a boolean response", () => {
    // given
    const response = true;

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("true");
  });

  test("E.Right when transforming a undefined response", () => {
    // given

    // when
    const transformedResponse = transformResponse(undefined);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("");
  });

  test("E.Right when transforming a Symbol response", () => {
    // given
    const response = Symbol("My symbol");

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("Symbol(My symbol)");
  });

  test("E.Right when transforming a BigInt response", () => {
    // given
    const response = BigInt(100000);

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("100000");
  });

  test("E.Right when transforming a Function response", () => {
    // given
    const response = () => "TEST";

    // when
    const transformedResponse = transformResponse(response);

    // then
    expect(transformedResponse).toBeDefined();
    expect(E.isRight(transformedResponse)).toEqual(true);
    expect(
      pipe(
        transformedResponse,
        E.getOrElse((e) => "")
      )
    ).toEqual("");
  });
});
