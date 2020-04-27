# Omicron - Simple HTTP servers

Omicron is a small library to build HTTP servers in Node.js.

Omicron uses a more functional approach compared to other solutions, e.g. the functions to create route handlers are curried by default which can be useful for function composition.

Omicron is compeltely written in TypeScript and has pretty good typing, which should help you to be more productive.

Please see `/example/example.ts` for an example setup.

## Usage

    npm i --save @zaetrik/omicron

## Documentation

Start a server that handles a `GET` request to `/` =>

    import * as omicron from "@zaetrik/omicron";

    const indexHandler = r
        ("/")
        ("GET")
        (() => "Hello 👋")
        ((res, res, error) => `Oops! An error occured => ${error.message}`);

    const listener = omicron.httpListener({
        // Here you can add all your routes that should be exposed
        routes: [
            indexHandler
        ],
    });

    const PORT = 3000; // Otherwise the default PORT is 7777

    // Create our server instance
    const server = omicron.createServer({ port: PORT, listener: listener });

    // await our server setup with await server
    const main: IO<void> = async () => await (await server)();

    // Call main() to start the server
    main();

    console.log(`Listening on https://localhost:${PORT || 7777}`)

### Route Handlers 🛤️

Route handlers can be created like this =>

    import * as omicron from "@zaetrik/omicron";

    const handler = omicron.r
        ("/") // Your path
        ("*") // HTTP method // * => Catch-all handler
        ((req, res) => "My Handler") // Handler function
        ((req, res, err) => err.message) // Error handler function

    const getHandler = omicron.get
        ("/get")
        ((req, res) => "My GET Handler")
        ((req, res, err) => err.message)

    const postHandler = omicron.post
        ("/post")
        ((req, res) => "My POST Handler")
        ((req, res, err) => err.message)

For the other HTTP methods there are also handlers available.

You have to define two handlers. One normal handler & one error handler.
The handler functions have the following type signature

    type RouteHandlerFn = (req: HttpRequest, res: HttpResponse, error?: Error) => TaskEither<Error, RouteResponse>;
