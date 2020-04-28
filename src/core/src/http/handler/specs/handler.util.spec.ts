import { HttpResponse, HttpRequest, ContentType } from "../../../http.interface";
import { createRouteHandlerFn, isRouteResponse, toRouteResponse, defaultHeaders } from "../handler.util";
import { RouteResponse } from "../../router/router.interface";

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

  test("isRouteResponse returns true if given a RouteResponse", () => {
    // given
    const routeResponse: RouteResponse = { response: "It works!", status: 200, headers: {} };

    // when
    const validateRouteResponse = isRouteResponse(routeResponse);

    // then
    expect(validateRouteResponse).toBeDefined();
    expect(validateRouteResponse).toEqual(true);
  });

  test("isRouteResponse returns false if given something else than a RouteResponse", () => {
    // given
    const notARouteResponse = { data: "my data" };

    // when
    const validateRouteResponse = isRouteResponse(notARouteResponse);

    // then
    expect(validateRouteResponse).toBeDefined();
    expect(validateRouteResponse).toEqual(false);
  });

  test("isRouteResponse returns false if given a RouteResponse with missing headers", () => {
    // given
    const routeResponse = { response: "It works!", status: 200 };

    // when
    const validateRouteResponse = isRouteResponse(routeResponse);

    // then
    expect(validateRouteResponse).toBeDefined();
    expect(validateRouteResponse).toEqual(false);
  });

  test("isRouteResponse returns false if given a RouteResponse with wrong Content-Type", () => {
    // given
    const routeResponse = {
      response: "It works!",
      status: 200,
      headers: { "Content-Type": "application" },
    };

    // when
    const validateRouteResponse = isRouteResponse(routeResponse);

    // then
    expect(validateRouteResponse).toBeDefined();
    expect(validateRouteResponse).toEqual(false);
  });

  test("isRouteResponse returns true if given a RouteResponse with correct Content-Type", () => {
    // given
    const routeResponse: RouteResponse = {
      response: "It works!",
      status: 200,
      headers: { "Content-Type": ContentType.APPLICATION_JSON },
    };

    // when
    const validateRouteResponse = isRouteResponse(routeResponse);

    // then
    expect(validateRouteResponse).toBeDefined();
    expect(validateRouteResponse).toEqual(true);
  });

  test("toRouteResponse returns a RouteResponse", () => {
    // given
    const routeResponse: RouteResponse = {
      response: "It works!",
      status: 500,
      headers: { "Content-Type": ContentType.APPLICATION_JSON },
    };

    const response = "It works!";
    const status = 500;
    const headers = {};

    // when
    const generatedRouteResponse = toRouteResponse(response, status, headers);

    // then
    expect(generatedRouteResponse).toBeDefined();
    expect(generatedRouteResponse).toEqual(routeResponse);
  });

  test("toRouteResponse returns a RouteResponse when only a response is given", () => {
    // given
    const routeResponse: RouteResponse = {
      response: "It works!",
      status: 200,
      headers: { "Content-Type": ContentType.APPLICATION_JSON },
    };

    const response = "It works!";

    // when
    const generatedRouteResponse = toRouteResponse(response);

    // then
    expect(generatedRouteResponse).toBeDefined();
    expect(generatedRouteResponse).toEqual(routeResponse);
  });

  test("toRouteResponse returns the default headers when {} is given for the headers parameter", () => {
    // given
    const headers = {};

    // when
    const generatedRouteResponse = toRouteResponse("It works!", 200, headers);

    // then
    expect(generatedRouteResponse).toBeDefined();
    expect(generatedRouteResponse.headers).toEqual(defaultHeaders);
  });

  test("toRouteResponse returns the default headers + the passed in headers, when headers are passed in but with missing default header values", () => {
    // given
    const headers = { "Set-Cookie": ["cookie=true"] };

    // when
    const generatedRouteResponse = toRouteResponse("It works!", 200, headers);

    // then
    expect(generatedRouteResponse).toBeDefined();
    expect(generatedRouteResponse.headers).toMatchObject(defaultHeaders);
  });
});
