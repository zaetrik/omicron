import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";
import axios from "axios";
import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import {
  HttpMethodType,
  RouteResponse,
  HttpMethod,
  HttpRequest,
  HttpResponse,
} from "../core/src/http.interface";

// We can create routes with those simple helper functions => {HTTP_METHOD}(path: string, handler: (req: omicron.HttpRequest, res: omicron.HttpResponse) => any)
const getHandler = omicron.get("/get")(async (req, res) => {
  const { data } = await axios.get("https://api.exchangeratesapi.io");
  throw new Error("error message");
  return data;
})(async (req, res, err) => {
  const { data } = await axios.get("https://api.exchangeratesapi.io");
  throw new Error("IN ERROR HANDLER");
  return { data, err: err.message };
});

const postHandler = omicron.post("/post")((req, res) => "My POST request")(
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

const listener = omicron.httpListener({
  // Here you can add all your routes that should be exposed
  routes: [
    getHandler,
    allHandler,
    postHandler,
    putHandler,
    deleteHandler,
    // You could also define your handler with an object like this
    /*{
      path: "/",
      method: "GET" as omicron.HttpMethod,
      handler: omicron.createRouteHandlerFn(
        async (
          req: omicron.HttpRequest,
          res: omicron.HttpResponse
        ): Promise<omicron.RouteResponse> => {
          const { data } = await axios.get("https://api.exchangeratesapi.io");

          return {
            status: 200,
            response: data,
            contentType: omicron.ContentType.TEXT_HTML,
          };
        }
      )(
        (
          req: omicron.HttpRequest,
          res: omicron.HttpResponse
        ): omicron.RouteResponse => {
          return {
            status: 500,
            response: "My error handler",
            contentType: omicron.ContentType.TEXT_HTML,
          };
        }
      ),
    },
    {
      path: "/path/:name",
      method: "GET" as omicron.HttpMethod,
      handler: omicron.createRouteHandlerFn(
        (
          req: omicron.HttpRequest,
          res: omicron.HttpResponse
        ): omicron.RouteResponse => {
          return {
            status: 200,
            response: `<h1>My name is ${req.params.name}</h1>`,
            contentType: omicron.ContentType.TEXT_HTML,
          };
        }
      )(
        (
          req: omicron.HttpRequest,
          res: omicron.HttpResponse
        ): omicron.RouteResponse => {
          return {
            status: 500,
            response: "My error handler",
            contentType: omicron.ContentType.TEXT_HTML,
          };
        }
      ),
    },*/
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
