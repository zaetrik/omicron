import * as omicron from "../index";
import { IO } from "fp-ts/lib/IO";

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
const myHandler = omicron.r("/myhandler")("GET")((req, res) => "My Handler")(
  () => "Error Handler"
);

const indexHandler = omicron.r("/")("GET")(() => "It works!")(
  () => "It doesn't work!"
);

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
