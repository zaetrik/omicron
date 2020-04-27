import { HttpResponse, HttpRequest, RouteResponse } from "../../../http.interface";
import * as methods from "../handler.methods";

describe("Handler request methods", () => {
  test("creates a GET route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.get("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("GET");
  });

  test("creates a POST route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.post("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("POST");
  });

  test("creates a DELETE route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.dlt("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("DELETE");
  });
  test("creates a PUT route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.put("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("PUT");
  });

  test("creates a catch-all route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.all("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("*");
  });

  test("creates a OPTIONS route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.options("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("OPTIONS");
  });

  /*test("creates a HEAD route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.head("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("HEAD");
  });*/

  /*test("creates a CONNECT route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.connect("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("CONNECT");
  });*/

  test("creates a PATCH route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.patch("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("PATCH");
  });

  test("creates a TRACE route handler", () => {
    // given
    const handler = (req: HttpRequest, res: HttpResponse, error?: Error) =>
      ({
        response: "data",
      } as RouteResponse);

    // when
    const routeHandler = methods.trace("/")(handler)(handler);

    // then
    expect(routeHandler).toBeDefined();
    expect(routeHandler.path).toEqual("/");
    expect(routeHandler.method).toEqual("TRACE");
  });
});
