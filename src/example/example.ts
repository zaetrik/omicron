import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";

// We can create routes with those simple helper functions => {HTTP_METHOD}(path: string, handler: (req: omicron.HttpRequest, res: omicron.HttpResponse) => any)
const getHandler = omicron.get("/get", (req, res) => "My GET request");
const postHandler = omicron.post("/post", (req, res) => "My POST request");
const putHandler = omicron.put("/put", (req, res) => "My PUT request");
const deleteHandler = omicron.dlt("/delete", (req, res) => "My DELETE request");
const allHandler = omicron.all("/all", (req, res) => "My catch all handler");

// We can also use reqOption & reqEither to handle our incoming request more like a stream
// reqOption & reqEither are Option or Either monads respectively
const option = omicron.reqOption.pipe(
  omicron.reqOption.matchPath("/option")(),
  omicron.reqOption.matchMethod("POST"),
  omicron.reqOption.use((req, res) => ({
    status: 200,
    response: { query: req.query, params: req.params, body: req.body },
    contentType: omicron.ContentType.TEXT_HTML,
  })),
  O.getOrElse(
    () =>
      ({
        path: "/option",
        method: "*",
        handler: omicron.errorHandler("Error in my route"),
      } as omicron.RouteHandler)
  )
);

const optionWithFlow = flow(
  omicron.reqOption.matchPath("/option/flow"),
  omicron.reqOption.matchMethod("GET"),
  omicron.reqOption.use((req, res) => ({
    response: { query: req.query, params: req.params, body: req.body },
  })),
  O.getOrElse(
    () =>
      ({
        path: "/option/flow",
        method: "*",
        handler: omicron.errorHandler("Error in my route"),
      } as omicron.RouteHandler)
  )
)();

const either = omicron.reqEither.pipe(
  omicron.reqEither.matchPath("/either")(),
  omicron.reqEither.matchMethod("POST"),
  omicron.reqEither.use((req, res) => ({
    status: 200,
    response: { query: req.query, params: req.params, body: req.body },
    contentType: omicron.ContentType.TEXT_HTML,
  })),
  E.getOrElse(
    (e: Error) =>
      ({
        path: "/either",
        method: "*",
        handler: omicron.errorHandler(e.message),
      } as omicron.RouteHandler)
  )
);

const eitherWithFlow = flow(
  omicron.reqEither.matchPath("/either/flow"),
  omicron.reqEither.matchMethod("GET"),
  omicron.reqEither.use((req, res) => ({
    response: { query: req.query, params: req.params, body: req.body },
  })),
  E.getOrElse(
    (e: Error) =>
      ({
        path: "/either/flow",
        method: "*",
        handler: omicron.errorHandler(e.message),
      } as omicron.RouteHandler)
  )
)();

const listener = omicron.httpListener({
  // Here you can add all your routes that should be exposed
  routes: [
    option,
    optionWithFlow,
    either,
    eitherWithFlow,
    getHandler,
    allHandler,
    postHandler,
    putHandler,
    deleteHandler,
    // You could also define your handler with an object like this
    {
      path: "/",
      method: "GET" as omicron.HttpMethod,
      handler: (
        req: omicron.HttpRequest,
        res: omicron.HttpResponse
      ): omicron.RouteResponse => {
        return {
          status: 200,
          response: `The query parameters are: ${JSON.stringify(req.query)}`,
          contentType: omicron.ContentType.TEXT_HTML,
        };
      },
    },
    {
      path: "/path/:name",
      method: "GET" as omicron.HttpMethod,
      handler: (
        req: omicron.HttpRequest,
        res: omicron.HttpResponse
      ): omicron.RouteResponse => {
        return {
          status: 200,
          response: `<h1>My name is ${req.params.name}</h1>`,
          contentType: omicron.ContentType.TEXT_HTML,
        };
      },
    },
  ],
});

const PORT = 3000;

// Get our server instance
const server = omicron.createServer({ port: PORT, listener: listener });

// await our server setup with await server
const main: IO<void> = async () => await (await server)();

// Call main() to start the server
main();

console.log(`Listening on https://localhost:${PORT}`);
