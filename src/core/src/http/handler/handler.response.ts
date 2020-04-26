import { HttpRequest, HttpResponse, ContentType } from "../../http.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { RouteHandlerFn } from "../router/router.interface";
import { IO } from "fp-ts/lib/IO";

const executeHandler = (
  req: HttpRequest,
  res: HttpResponse,
  routeHandler: RouteHandlerFn,
  errorHandler: RouteHandlerFn
): IO<void> => async () =>
  await pipe(
    // Here we execute our route handler and wrap it inside an Either<Error, RouteResponse>
    await pipe(routeHandler(req, res))(),
    E.fold(
      // If error in our route handler =>
      async (err) =>
        pipe(
          // Execute errorHandler and wrap it inside an Either<Error, RouteResponse>
          await pipe(errorHandler(req, res, err))(),
          E.fold(
            // If error in errorHandler =>
            (errorHandlerError) =>
              sendResponse(res, { response: errorHandlerError.message }),
            // If errorHandler successful
            (errorHandlerSuccess) => sendResponse(res, errorHandlerSuccess)
          )
        ),
      // If routeHandler successful =>
      async (result) => sendResponse(res, result)
    )
  );

const transformResponse = (response: any): string => {
  switch (typeof response) {
    case "object":
      return JSON.stringify(response);
    case "string":
      return response;
    case "number":
      return response.toString();
    default:
      return response;
  }
};

const sendResponse = (
  res: HttpResponse,
  { status = 200, response = "", contentType = ContentType.APPLICATION_JSON }
) => {
  res.writeHead(status, {
    "Content-Type": contentType,
  });

  res.end(transformResponse(response));
};

export const handleResponse = (routeHandler: RouteHandlerFn) => (
  errorHandler: RouteHandlerFn
) => (req: HttpRequest) => (res: HttpResponse) => {
  executeHandler(req, res, routeHandler, errorHandler)();
};
