import { HttpResponse, HttpRequest, RouteResponse } from "../../../http.interface";
import { r } from "../handler.request";

describe("Handler request", () => {
  test("creates a route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = r("/")("GET")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("GET");
  });
});
