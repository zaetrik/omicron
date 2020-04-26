import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import {
  HttpMethod,
  HttpRequest,
  HttpResponse,
  ContentType,
} from "../core/src/http.interface";
import { RouteHandler } from "../core/src/http/router/router.interface";
import { r } from "../core/src/http/handler/handler.request";

// We can create routes with those simple helper functions => {HTTP_METHOD}(path: string)(handler: (req: omicron.HttpRequest, res: omicron.HttpResponse) => any)(errorHandler: (req: omicron.HttpRequest, res: omicron.HttpResponse, error: Error) => any)
const getHandler = omicron.get("/get")(async (req, res) => {
  const wait = (timeout: number) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

  await wait(5000);

  return "It works";
})((req, res, err) => {
  return err.message;
});

const postHandler = omicron.post("/post")((req, res) => req.body)(
  (req, res, err) => "My error handler"
);

const putHandler = omicron.put("/put")((req, res) => "My PUT request")(
  (req, res) => "My error handler"
);

const deleteHandler = omicron.dlt("/delete")((req, res) => "My DELETE request")(
  (req, res) => "My error handler"
);

const allHandler = omicron.all("/all")((req, res) => "My catch all handler")(
  (req, res) => "My error handler"
);

// You can also contruct a RouteHandler with the r() function
const myHandler = r("/myhandler")("GET")(() =>
  Promise.reject({
    response: "Handler",
  })
)(() => ({ response: "Error Handler" }));

// Under the hood the previous helper functions construct this object:
const manualWay: RouteHandler = {
  path: "/manual",
  method: "GET" as HttpMethod,
  handler: (req: HttpRequest, res: HttpResponse) =>
    TE.tryCatch(
      async () => ({
        response: "Manual Handler",
        status: 200,
        contentType: ContentType.TEXT_HTML,
      }),
      E.toError
    ),
  errorHandler: (req: HttpRequest, res: HttpResponse, err: Error) =>
    TE.tryCatch(
      async () => ({ response: `An error occured: ${err.message}` }),
      E.toError
    ),
};

const listener = omicron.httpListener({
  // Here you can add all your routes that should be exposed
  routes: [
    myHandler,
    manualWay,
    getHandler,
    allHandler,
    postHandler,
    putHandler,
    deleteHandler,
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
