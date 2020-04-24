import {
  RouteResponse,
  ContentType,
  HttpRequest,
  HttpResponse,
} from "../../http.interface";

export const errorHandler = (err: string) => (
  req: HttpRequest,
  res: HttpResponse
): RouteResponse => ({
  status: 500,
  response: `<h1>${err}</h1>`,
  contentType: ContentType.TEXT_HTML,
});
