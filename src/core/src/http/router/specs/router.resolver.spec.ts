import { matchRoute } from "../router.matcher";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import {
  HttpRequest,
  HttpResponse,
  ContentType,
} from "../../../http.interface";
import { RouteHandler } from "../router.interface";
import { pipe } from "fp-ts/lib/pipeable";
import { resolveRequest } from "../router.resolver";
const MockReq = require("mock-req");

describe("Resolves route", () => {
  const routeHandler: RouteHandler = {
    path: "/name/:name",
    method: "POST",
    handler: (req: HttpRequest, res: HttpResponse) =>
      TE.tryCatch(
        async () => ({
          response: "Fallback Handler",
        }),
        E.toError
      ),
    errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
      TE.tryCatch(
        async () => ({ response: `An error occured: ${err.message}` }),
        E.toError
      ),
  };

  test("resolves route with correct RouteHandler => POST /name/:name route", async () => {
    // given
    const req = new MockReq({ method: "POST", url: "/name/cedric" });
    req.write({
      data: "works",
    });
    req.end();

    // when
    const resolvedRequest = resolveRequest(req)(routeHandler);

    // then
    expect(resolvedRequest).toBeDefined();
    expect(resolvedRequest._tag).toEqual("Some");

    // when
    const awaitedResolvedRequest = await pipe(
      resolvedRequest,
      O.getOrElse(() => Promise.reject(O.some({})))
    );

    // then
    expect(awaitedResolvedRequest.errorHandler).toBeDefined();
    expect(awaitedResolvedRequest.populatedReq).toBeDefined();
    expect(awaitedResolvedRequest.populatedReq.body).toBeDefined();
    expect(awaitedResolvedRequest.populatedReq.params).toBeDefined();
    expect(awaitedResolvedRequest.populatedReq.query).toBeDefined();
    expect(awaitedResolvedRequest.routeHandler).toBeDefined();
  });
});
