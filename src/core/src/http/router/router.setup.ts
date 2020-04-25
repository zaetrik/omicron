import { RouteHandler } from "./router.interface";

const preparePath = (path: string): string =>
  path
    .replace(/\/\*/g, "/(.*)") /* Transfer wildcards */
    .replace(/\/\/+/g, "/") /* Remove repeated backslashes */
    .replace(/\/$/, ""); /* Remove trailing backslash */

export const setupRouting = (routeHandlers: RouteHandler[]): RouteHandler[] =>
  routeHandlers.map((handler) => {
    const preparedPath = preparePath(handler.path);
    return {
      path: preparedPath,
      method: handler.method,
      handler: handler.handler,
      errorHandler: handler.errorHandler,
    };
  });
