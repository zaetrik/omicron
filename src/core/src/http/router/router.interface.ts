import { HttpMethod, HttpRequest } from "../../http.interface";
import { TaskEither } from "fp-ts/lib/TaskEither";
import * as io from "io-ts";

const RouteResponseHeadersValidation = io.partial({
  "Content-Type": io.keyof({
    "application/*": null,
    "application/rtf": null,
    "application/zip": null,
    "application/x-rar-compressed": null,
    "application/x-tar": null,
    "application/x-7z-compressed": null,
    "application/x-www-form-urlencoded": null,
    "application/pdf": null,
    "application/json": null,
    "application/javascript": null,
    "application/ecmascript": null,
    "application/xml": null,
    "application/octet-stream": null,
    "application/vnd.api+json": null,
    "text/plain": null,
    "text/html": null,
    "text/css": null,
    "text/csv": null,
    "image/webp": null,
    "image/jpeg": null,
    "image/png": null,
    "image/gif": null,
    "image/tiff": null,
    "image/svg+xml": null,
    "audio/mpeg": null,
    "audio/ogg": null,
    "audio/*": null,
    "video/webm": null,
    "video/mp4": null,
    "font/ttf": null,
    "font/woff": null,
    "font/woff2": null,
    "multipart/form-data": null,
  }),
});

export const RouteResponseValidation = io.strict({
  response: io.any,
  status: io.number,
  headers: RouteResponseHeadersValidation,
});

export type RouteResponseHeadersValidation = io.TypeOf<typeof RouteResponseHeadersValidation>;
export type RouteResponseValidation = io.TypeOf<typeof RouteResponseValidation>;
export interface RouteResponseHeaders extends RouteResponseHeadersValidation {
  [key: string]: number | string | string[];
}
export interface RouteResponse {
  response: any;
  status: number;
  headers: RouteResponseHeaders;
}

export interface RouteHandler {
  path: string;
  method: HttpMethod;
  handler: RouteHandlerFn;
  errorHandler: RouteHandlerFn;
}

export type RouteHandlerFn = (req: HttpRequest, error?: Error) => TaskEither<Error, RouteResponse | unknown>;
