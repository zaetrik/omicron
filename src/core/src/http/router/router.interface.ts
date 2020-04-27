import { RouteResponse, HttpMethod, HttpRequest, HttpResponse } from "../../http.interface";
import { TaskEither } from "fp-ts/lib/TaskEither";

export interface RouteHandler {
  path: string;
  method: HttpMethod;
  handler: RouteHandlerFn;
  errorHandler: RouteHandlerFn;
}

export type RouteHandlerFn = (
  req: HttpRequest,
  res: HttpResponse,
  error?: Error
) => TaskEither<Error, RouteResponse>;
