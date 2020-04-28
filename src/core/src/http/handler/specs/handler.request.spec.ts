import { HttpResponse, HttpRequest } from "../../../http.interface";
import { r } from "../handler.request";
import { RouteResponse } from "../../router/router.interface";

describe("Handler request", () => {
  test("creates a route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) => "data";

    // when
    const routeHandler = r("/")("GET")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("GET");
  });
});
