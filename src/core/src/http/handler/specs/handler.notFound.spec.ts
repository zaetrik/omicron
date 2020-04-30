import { defaultNotFoundRouteResponse, notFoundHandler } from "../handler.notFound";
const MockReq = require("mock-req");

describe("Not found handler", () => {
  test("creates a Not Found RouteHandlerFn", () => {
    // given

    // when
    const notFoundRouteHandlerFn = notFoundHandler();

    // then
    expect(notFoundRouteHandlerFn).toBeDefined();
  });

  test("creates a Not Found handler function that returns a RouteResponse", () => {
    // given
    const req = new MockReq({ method: "GET", url: "/" });
    req.end();

    // when
    const notFoundRouteHandler = defaultNotFoundRouteResponse(req);

    // then
    expect(notFoundRouteHandler).toBeDefined();
    expect(notFoundRouteHandler.status).toEqual(404);
    expect(notFoundRouteHandler.response).toEqual(`<h1>Not Found</h1>`);
  });
});
