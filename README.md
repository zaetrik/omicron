# Omicron - Simple HTTP servers

Omicron is a small library to build HTTP servers.

Please see `/example/example.ts` for an example setup.

## Usage

    npm i --save @zaetrik/omicron fp-ts

`fp-ts` is needed in order to work properly with `omicron`.

## Documentation

Start a server that handles a `GET` request to `/` =>

    import * as omicron from "@zaetrik/omicron";

    const indexHandler = r
        ("/")
        ("GET")
        (() => ({ response: "Hello 👋" }))
        (() => ({ response: "Error Handler" }));

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

Route handlers can be created in multiple ways =>

    import * as omicron from "@zaetrik/omicron";
    import * as TE from "fp-ts/lib/TaskEither";

    const handler = omicron.r
        ("/")
        ("*") // Catch-all handler
        ((req, res) => "My GET Handler")
        ((req, res, err) => err.message)

    const getHandler = omicron.get
        ("/get")
        ((req, res) => "My GET Handler")
        ((req, res, err) => err.message)

    const postHandler = omicron.post
        ("/post")
        ((req, res) => "My POST Handler")
        ((req, res, err) => err.message)

    // all, dlt & put are also available to create route handlers

    // You could also create them manually
    // The functions above just construct an object like this

    const manualWay = {
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

    // You have to define two handlers. One normal handler & one error handlers.
    // The handler functions have the following type signature
        type RouteHandlerFn =
            (req: HttpRequest,
            res: HttpResponse,
            error?: Error) => TaskEither<Error, RouteResponse>;
