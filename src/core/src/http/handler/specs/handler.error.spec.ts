import { errorHandler } from "../handler.error";

describe("Error handler", () => {
  test("creates an error RouteHandlerFn", () => {
    // given

    // when
    const errorRouteHandlerFn = errorHandler("My error");

    // then
    expect(errorRouteHandlerFn).toBeDefined();
  });
});
