import { HttpResponse, HttpRequest } from "../../../http.interface";
import { createRouteHandlerFn } from "../handler.util";

describe("Handler utils", () => {
  test("creates a route handler function", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse) => ({
      response: "data",
    });

    // when
    const routeHandlerFn = createRouteHandlerFn(handler);

    // then
    expect(routeHandlerFn).toBeDefined();
  });
});
