import { setupRouting } from "../router.setup";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { RouteHandler } from "../router.interface";
import { HttpRequest, HttpResponse, ContentType } from "../../../http.interface";

describe("Get request params", () => {
  const routeHandlers: RouteHandler[] = [
    {
      path: "/",
      method: "GET",
      handler: (req: HttpRequest, res: HttpResponse) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
    {
      path: "/name/:name",
      method: "GET",
      handler: (req: HttpRequest, res: HttpResponse) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
            status: 200,
            contentType: ContentType.TEXT_HTML,
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
    {
      path: "/name/:name",
      method: "POST",
      handler: (req: HttpRequest, res: HttpResponse) =>
        TE.tryCatch(
          async () => ({
            response: "Handler",
            status: 200,
            contentType: ContentType.TEXT_HTML,
          }),
          E.toError
        ),
      errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
        TE.tryCatch(async () => ({ response: `An error occured: ${err.message}` }), E.toError),
    },
  ];

  test("Setups routes from RouteHandler[]", () => {
    // given => RouteHandlers[]

    // when
    const setupRouteHandlers = setupRouting(routeHandlers);

    // then
    expect(setupRouteHandlers).toBeDefined();
    expect(setupRouteHandlers.length).toEqual(routeHandlers.length);
  });
});
