import { HttpRequest, HttpResponse, ContentType } from "../../http.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { RouteHandlerFn, RouteResponse } from "../router/router.interface";
import { IO } from "fp-ts/lib/IO";
import { isRouteResponse, toRouteResponse, defaultHeaders } from "./handler.util";

const executeHandler = (
  req: HttpRequest,
  res: HttpResponse,
  routeHandler: RouteHandlerFn,
  errorHandler: RouteHandlerFn
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
              }),
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
              )
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
        )
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

const sendResponse = (res: HttpResponse) => ({
  status = 200,
  response = "",
  headers = defaultHeaders,
}: RouteResponse) => {
  res.writeHead(status, headers);

  res.end(transformResponse(response));
};

export const handleResponse = (routeHandler: RouteHandlerFn) => (errorHandler: RouteHandlerFn) => (
  req: HttpRequest
) => (res: HttpResponse) => {
  executeHandler(req, res, routeHandler, errorHandler)();
};
