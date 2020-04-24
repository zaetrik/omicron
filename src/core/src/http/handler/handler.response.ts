import {
  RouteResponse,
  HttpRequest,
  HttpResponse,
  ContentType,
} from "../../http.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

export const handleResponse = (
  routeHandler: (req: HttpRequest, res: HttpResponse) => RouteResponse
) => (req: HttpRequest) => (res: HttpResponse) => {
  const {
    status = 200,
    response = "",
    contentType = ContentType.APPLICATION_JSON,
  } = pipe(
    E.tryCatch(() => routeHandler(req, res), E.toError),
    E.getOrElse(
      (e) =>
        ({
          status: 500,
          response: e.message,
        } as RouteResponse)
    )
  );

  res.writeHead(status, {
    "Content-Type": contentType,
  });

  res.end(transformResponse(response));
};

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
