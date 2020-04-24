import {
  RouteResponse,
  HttpRequest,
  HttpResponse,
  ContentType,
} from "../../http.interface";

export const handleResponse = (
  routeHandler: (req: HttpRequest, res: HttpResponse) => RouteResponse
) => (req: HttpRequest) => (res: HttpResponse) => {
  const {
    status = 200,
    response = "",
    contentType = ContentType.APPLICATION_JSON,
  } = routeHandler(req, res);

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
