import { errorHandler, defaultErrorHandlerRouteResponse } from "../handler.error";
const MockReq = require("mock-req");

describe("Error handler", () => {
  test("creates an error RouteHandlerFn", () => {
    // given

    // when
    const errorRouteHandlerFn = errorHandler("My error");

    // then
    expect(errorRouteHandlerFn).toBeDefined();
  });

  test("creates an error handler function that returns a RouteResponse", () => {
    // given
    const req = new MockReq({ method: "GET", url: "/" });
    req.end();
    const error = "My error";

    // when
    const errorRouteHandler = defaultErrorHandlerRouteResponse("My error")(req);

    // then
    expect(errorRouteHandler).toBeDefined();
    expect(errorRouteHandler.status).toEqual(500);
    expect(errorRouteHandler.response).toEqual(`<h1>My error</h1>`);
  });
});
