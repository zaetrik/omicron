import {
  RouteResponse,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  HttpMethodType,
} from "../../http.interface";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { Task } from "fp-ts/lib/Task";

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
