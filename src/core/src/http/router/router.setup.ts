import { RouteHandler, RegisteredRouteHandler } from "./router.interface";
import { pathToRegexp, Key } from "path-to-regexp";
import { RouteResponse, ContentType } from "../../http.interface";

export interface ParsedPath {
  regExp: RegExp;
  parameters?: string[] | undefined;
  path: string;
}

// Taken from https://github.com/marblejs/marble/blob/master/packages/core/src/http/router/http.router.params.factory.ts
const parsePath = (path: string): ParsedPath => {
  const keys: Key[] = [];
  const preparedPath = path
    .replace(/\/\*/g, "/(.*)") /* Transfer wildcards */
    .replace(/\/\/+/g, "/") /* Remove repeated backslashes */
    .replace(/\/$/, ""); /* Remove trailing backslash */

  const regExp = pathToRegexp(preparedPath, keys, { strict: false });
  const regExpParameters = keys
    .filter((key) => key.name !== 0) /* Filter wildcard groups */
    .map((key) => String(key.name));

  return {
    regExp,
    parameters: regExpParameters.length > 0 ? regExpParameters : undefined,
    path: preparedPath,
  };
};

export const setupRouting = (
  routeHandlers: RouteHandler[]
): RegisteredRouteHandler[] =>
  routeHandlers.map((handler) => {
    const parsedPath = parsePath(handler.path);
    return {
      pathRegExp: parsedPath.regExp,
      path: parsedPath.path,
      parameters: parsedPath.parameters,
      method: handler.method,
      handler: handler.handler,
    };
  });

/*console.log(
  setupRouting([
    {
      path: "/test/:name",
      method: "GET",
      handler: (req, res): RouteResponse => ({
        status: 200,
        response: "fghjk",
        contentType: ContentType.TEXT_HTML,
      }),
    },
    {
      path: "/test/:name/cool",
      method: "GET",
      handler: (req, res): RouteResponse => ({
        status: 200,
        response: "fghjk",
        contentType: ContentType.TEXT_HTML,
      }),
    },
    {
      path: "/frip/fgfhjd",
      method: "GET",
      handler: (req, res): RouteResponse => ({
        status: 200,
        response: "fghjk",
        contentType: ContentType.TEXT_HTML,
      }),
    },
  ])
);*/
