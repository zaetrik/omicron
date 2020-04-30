import { HttpRequest, HttpResponse, ContentType } from "../../http.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { RouteHandlerFn, RouteResponse, ErrorRouteHandlerFn } from "../router/router.interface";
import { IO } from "fp-ts/lib/IO";
import { isRouteResponse, toRouteResponse } from "./handler.util";
import { defaultHeaders } from "./handler.interface";

const executeHandler = (
  req: HttpRequest,
  res: HttpResponse,
  routeHandler: RouteHandlerFn,
  errorHandler: ErrorRouteHandlerFn
): IO<void> => async () =>
  await pipe(
    // Here we execute our route handler and wrap it inside an Either<Error, RouteResponse>
    await pipe(routeHandler(req))(),
    E.fold(
      // If error in our route handler =>
      async (err) =>
        pipe(
          // Execute errorHandler and wrap it inside an Either<Error, RouteResponse>
          await pipe(errorHandler(req, err))(),
          E.fold(
            // If error in errorHandler =>
            (errorHandlerError) =>
              sendResponse(res)({
                response: errorHandlerError.message,
                status: 500,
                headers: { "Content-Type": ContentType.TEXT_PLAIN },
              })(),
            // If errorHandler successful

            (errorHandlerSuccess) =>
              sendResponse(res)(
                isRouteResponse(errorHandlerSuccess)
                  ? // We do toRouteResponse again to apply the default headers if {} is passed for the headers
                    toRouteResponse(
                      (errorHandlerSuccess as RouteResponse).response,
                      (errorHandlerSuccess as RouteResponse).status,
                      (errorHandlerSuccess as RouteResponse).headers
                    )
                  : toRouteResponse(errorHandlerSuccess, 500)
              )()
          )
        ),
      // If routeHandler successful =>
      async (result) =>
        sendResponse(res)(
          isRouteResponse(result)
            ? // We do toRouteResponse again to apply the default headers if {} is passed for the headers
              toRouteResponse(
                (result as RouteResponse).response,
                (result as RouteResponse).status,
                (result as RouteResponse).headers
              )
            : toRouteResponse(result)
        )()
    )
  );

export const transformResponse = (response: any): E.Either<Error, string> => {
  switch (typeof response) {
    case "object":
      return E.tryCatch(() => JSON.stringify(response), E.toError);
    case "string":
      return E.tryCatch(() => response, E.toError);
    case "number":
      return E.tryCatch(() => response.toString(), E.toError);
    case "boolean":
      return E.tryCatch(() => response.toString(), E.toError);
    case "undefined":
      return E.tryCatch(() => "", E.toError);
    case "function":
      return E.tryCatch(() => "", E.toError);
    case "bigint":
      return E.tryCatch(() => response.toString(), E.toError);
    case "symbol":
      return E.tryCatch(() => response.toString(), E.toError);
    // Removing the default case for the 100% test coverage
    //default:
    //return E.tryCatch(() => response, E.toError);
  }
};

export const sendResponse = (res: HttpResponse) => ({
  status = 200,
  response = "",
  headers = defaultHeaders,
}: RouteResponse): IO<void> => () => {
  res.writeHead(status, headers);

  const transformedResponse = pipe(
    transformResponse(response),
    E.fold(
      (err) => {
        res.writeHead(500, "Internal Server Error", headers);
        res.end();
        throw new Error("Could not parse response: " + err);
      },
      (res) => res
    )
  );

  res.end(transformedResponse);
};

export const handleResponse = (routeHandler: RouteHandlerFn) => (errorHandler: ErrorRouteHandlerFn) => (
  req: HttpRequest
) => (res: HttpResponse): IO<void> => () => {
  executeHandler(req, res, routeHandler, errorHandler)();
};
