# Omicron - Simple HTTP servers

[![coverage report](https://gitlab.com/Cedomic/omicron/badges/master/coverage.svg)](https://gitlab.com/Cedomic/omicron/-/commits/master) [![pipeline status](https://gitlab.com/Cedomic/omicron/badges/master/pipeline.svg)](https://gitlab.com/Cedomic/omicron/-/commits/master)

Omicron is a small library to build HTTP servers in Node.js in a more functional way.

Omicron uses a more functional approach compared to other solutions.

In Omicron every route handler you implement is just a basic function that eventually receives a `req: HttpRequest` object or in the case of an error handler also an `Error`. The handler function just returns the data that will be sent back to the client.

This allows you to do things like function composition and other powerful stuff with your handlers. For example when you use middlewares with `useMiddleware()` it composes the middleware functions with your normal handler function.

Omicron is written in TypeScript and has pretty good typing, which should help you to be more productive.

Please see `/example/example.ts` for an example setup.

## Usage

    npm i --save @zaetrik/omicron

For some features, like middlewares, you also need the [fp-ts](https://github.com/gcanti/fp-ts) library.

    npm i --save fp-ts

## Documentation

Start a server that handles a `GET` request to `/` =>

    import * as omicron from "@zaetrik/omicron";

    const indexHandler = r
        ("/")
        ("GET")
        ((req) => "Hello 👋")
        ((req, error) => `Oops! An error occured => ${error.message}`);

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
        ((req) => "My Handler") // Handler function
        ((req, err) => err.message) // Error handler function

    const getHandler = omicron.get
        ("/get")
        ((req) => "My GET Handler")
        ((req, err) => err.message)

    const postHandler = omicron.post
        ("/post")
        ((req) => "My POST Handler")
        ((req, err) => err.message)

    // To return a response with custom options you have to return something of type RouteResponse
    interface RouteResponse {
        response: any;
        status: number;
        headers: RouteResponseHeaders;
    }
    // If you would like to just return the default headers set headers to {}

    const handlerWithCustomOptions = omicron.r
        ("/custom")
        ("GET")
        ((req) =>
            ({
                response: "My Handler Response", // Data that should be returned as a response
                status: 200, // Custom status code
                headers: { "Set-Cookie": ["cookie=true"] } // Pass in all your custom headers
            })
        ((req, err) => err.message)

For the other HTTP methods there are also handlers available.

In order for your route to work you have to define two handlers. One normal handler & one error handler. This forces you to handle the possible error scenario on every route.

### Middleware 🖖

    import * as omicron from "@zaetrik/omicron";
    import * as E from "fp-ts/lib/Either";
    import { flow } from "fp-ts/lib/function";

    // This is how you can create middleware
    const authenticated: omicron.Middleware = (req: omicron.HttpRequest) =>
        req.query.number > 10 ? E.right(req) : E.left(new Error("Number is not > 10"));

    const isBob: omicron.Middleware = (req: omicron.HttpRequest) =>
        req.query.name === "Bob" ? E.right(req) : E.left(new Error("User is not Bob"));

    const handlerWithMiddleware = omicron.r
        ("/middleware")
        ("GET")
        (omicron.useMiddleware
                ([authenticated])
                ((req) => "User is authenticated"))
        ((req, err) => err.message);


    const handlerWithMultipleMiddlewares = omicron.r
        ("/multiple-middlewares")
        ("GET")
        (omicron.useMiddleware
            // Middlewares are executed from left to right
            ([authenticated, isBob])
            ((req) => "User is authenticated and his name is Bob"))
        ((req, err) => err.message);

As you can see we use the `useMiddleware([middleware])(handler)(errorHandler?)` function instead of a basic handler function we use normally. Any middleware function has to return something of type `Either<Error, HttpRequest | unknown>` (Either is a type from [fp-ts](https://github.com/gcanti/fp-ts)).

The default behaviour of the middleware is to throw the error in the handler and then you should handle it in your error handler like you always do.
Another option is to pass an additional error handler to `useMiddleware()()(errorHandler)` which will handle any error from the middleware.

The value returned from the middleware is used as the first parameter of your handler function, which is normally the `req: HttpRequest` object, but it could be whatever you like.

Another way of creating and using middleware is this =>

    import * as omicron from "@zaetrik/omicron";

    const authenticatedErrorThrowing: omicron.ErrorThrowingMiddleware = (req: HttpRequest) =>
        req.query.number > 10
            ? req
            : (() => {
                throw new Error("Number is not > 10");
            })();

    const isBobErrorThrowing: omicron.ErrorThrowingMiddleware = (req: omicron.HttpRequest) =>
        req.query.name === "Bob"
            ? req
            : (() => {
                throw new Error("User is not Bob");
            })();

    const handlerWithErrorThrowingMiddlewares = omicron.r
        ("/middleware-error-throwing")
        ("GET")
        (omicron.useErrorThrowingMiddleware
            ([authenticatedErrorThrowing, isBobErrorThrowing])
            ((req) => "User is authenticated and his name is Bob"))
        ((_, err) => err.message);

You also have the option to create middleware that just returns the raw value. Middleware of type `ErrorThrowingMiddleware` has to return either the raw value, that should be passed to the next middleware or the route handler, or it has to throw an error, which will then be passed to your error handler.

Error throwing middleware can only be used with `useErrorThrowingMiddleware()`.
