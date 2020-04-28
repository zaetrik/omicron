import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";
import { RouteResponse } from "../core/src/http/router/router.interface";

// We can create routes with those simple helper functions => {HTTP_METHOD}(path: string)(handler: (req: omicron.HttpRequest, res: omicron.HttpResponse) => any)(errorHandler: (req: omicron.HttpRequest, res: omicron.HttpResponse, error: Error) => any)
const getHandler = omicron.get("/get")(async (req, res) => {
  const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

  await wait(5000);

  return "It works";
})((req, res, err) => {
  return err.message;
});

const postHandler = omicron.post("/post")((req, res) => {
  return req.body;
})((req, res, err) => "My error handler");

const putHandler = omicron.put("/put")((req, res) => "My PUT request")((req, res) => "My error handler");

const deleteHandler = omicron.dlt("/delete")((req, res) => "My DELETE request")(
  (req, res) => "My error handler"
);

const allHandler = omicron.all("/all")((req, res) => "My catch all handler")(
  (req, res) => "My error handler"
);

// You can also contruct a RouteHandler with the r() function
const myHandler = omicron.r("/myhandler")("GET")((req, res) => "My Handler")(() => "Error Handler");

const indexHandler = omicron.r("/")("GET")(() => "It works!")(() => "It doesn't work!");

// You could also pass in a handler function that returns a RouteResponse. This only works if you return a complete RouteResponse.
// Returning just {response: "My response"} will set the default options and send back {response: "My response"} to the client
const handlerWithOptions = omicron.r("/withoptions")("GET")(
  () =>
    ({
      response: "This is my response, which could be anything",
      status: 200, // You can set a custom status code
      headers: { "Set-Cookie": ["cookie=true"] }, // Here you can set all your custom headers. If you don't want to set any custom headers, just set headers to {}
    } as RouteResponse)
)((_, __, err) => err);

const listener = omicron.httpListener({
  // Here you can add all your routes that should be exposed
  routes: [
    indexHandler,
    myHandler,
    getHandler,
    allHandler,
    postHandler,
    putHandler,
    deleteHandler,
    handlerWithOptions,
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
