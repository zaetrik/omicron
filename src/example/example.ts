import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";
import { RouteResponse } from "../core/src/http/router/router.interface";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const getHandler = omicron.get("/get")(async (req) => {
  await wait(5000);

  return "It works";
})((req, err) => {
  return err.message;
});

const postHandler = omicron.post("/post")((req) => {
  return req.body;
})((req, err) => "My error handler");

const putHandler = omicron.put("/put")((req) => "My PUT request")((req) => "My error handler");

const deleteHandler = omicron.dlt("/delete")((req) => "My DELETE request")((req) => "My error handler");

const allHandler = omicron.all("/all")((req) => "My catch all handler")((req) => "My error handler");

// You can also contruct a RouteHandler with the r() function
const myHandler = omicron.r("/myhandler")("GET")((req) => "My Handler")(() => "Error Handler");

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
)((_, err) => err);

// This is how you can create middleware
const authenticated: omicron.Middleware = (req: omicron.HttpRequest) =>
  req.query.number > 10 ? E.right(req) : E.left(new Error("Number is not > 10"));

const isBob: omicron.Middleware = (req: omicron.HttpRequest) =>
  req.query.name === "Bob" ? E.right(req) : E.left(new Error("User is not Bob"));

// This is how you use middleware in your handlers
// Default behaviour is to throw the error in the handler
// Then you should handle it in your error handler
// Another option is to pass an additional error handler to useMiddleware() which will handle any errors from the middleware
const handlerWithMiddleware = omicron.r("/middleware")("GET")(
  omicron.useMiddleware(authenticated)((req) => "User is authenticated")
)((req, err) => err.message);

// You can also use multiple middlewares
// The middleware functions have to be composed to a single function (here we used flow() from fp-ts which is used for function composition from left to right)
const handlerWithMultipleMiddlewares = omicron.r("/multiple-middlewares")("GET")(
  omicron.useMiddleware(flow(authenticated, E.chain(isBob)))(
    (req) => "User is authenticated and his name is Bob"
  )
)((req, err) => err.message);

const listener = omicron.httpListener({
  // Here you can add all your routes that should be exposed
  routes: [
    handlerWithMiddleware,
    handlerWithMultipleMiddlewares,
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
