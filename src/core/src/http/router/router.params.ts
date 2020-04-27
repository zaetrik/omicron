import { match, MatchResult } from "path-to-regexp";
import { PathParameters } from "../../http.interface";

export const getPathParams = (routeHandlerPath: string, reqUrl: string): PathParameters => {
  const { params } = match(routeHandlerPath, { decode: decodeURIComponent })(reqUrl) as MatchResult<{
    params: object;
  }>;

  return params;
};
