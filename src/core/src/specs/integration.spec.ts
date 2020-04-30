import supertest from "supertest";
import * as omicron from "../../../index";
import * as E from "fp-ts/lib/Either";

jest.setTimeout(15000);

describe("Integration Test", () => {
  let server: omicron.HttpServer;

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  const getServerInstance = async (handlers: omicron.RouteHandler[]) => {
    const app = await omicron.createServer({
      listener: omicron.httpListener({
        routes: handlers,
      }),
      port: 4000,
    });
    server = await app();
  };

  test("Server is reachable", async (done) => {
    // given
    const handler = omicron.r("/")("GET")(() => ({
      response: "It works!",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server).get("/").expect("Content-Type", omicron.ContentType.TEXT_PLAIN).expect(200);

    done();
  });

  test("Handles request made with r()", async (done) => {
    // given
    const handler = omicron.r("/name/:name")("POST")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .post("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with get()", async (done) => {
    // given
    const handler = omicron.get("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .get("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with post()", async (done) => {
    // given
    const handler = omicron.post("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .post("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with put()", async (done) => {
    // given
    const handler = omicron.put("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .put("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with dlt()", async (done) => {
    // given
    const handler = omicron.dlt("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .delete("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with all()", async (done) => {
    // given
    const handler = omicron.all("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .get("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .post("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .put("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .delete("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .patch("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .options("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with options()", async (done) => {
    // given
    const handler = omicron.options("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .options("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request made with patch()", async (done) => {
    // given
    const handler = omicron.patch("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .patch("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  /*test("Handles request made with head()", async (done) => {
    // given
    const handler = omicron.head("/name/:name")(
      (req: omicron.HttpRequest) => ({ body: req.body, params: req.params, query: req.query }),
      
    )(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .head("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });*/

  test("Handles request made with trace()", async (done) => {
    // given
    const handler = omicron.trace("/name/:name")((req: omicron.HttpRequest) => ({
      body: req.body,
      params: req.params,
      query: req.query,
    }))(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .trace("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  /*test("Handles request made with connect()", async (done) => {
    // given
    const handler = omicron.connect("/name/:name")(
      (req: omicron.HttpRequest) => ({ body: req.body, params: req.params, query: req.query }),
      
    )(() => "It doesn't work!");

    await getServerInstance([handler]);

    await supertest(server)
      .connect("/name/bob?query=true")
      .send({ data: "It works!" })
      .expect("Content-Type", omicron.ContentType.APPLICATION_JSON)
      .expect(function (res) {
        if (
          res.body.body.data === "It works!" &&
          res.body.query.query === "true" &&
          res.body.params.name === "bob"
        ) {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });*/

  test("Handles request that fails", async (done) => {
    // given
    const handler = omicron.get("/")((req: omicron.HttpRequest) => {
      throw new Error("We threw an error");
    })((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handler]);

    await supertest(server)
      .get("/")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "We threw an error") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(500);

    done();
  });

  test("Handles request whose error handler also fails", async (done) => {
    // given
    const handler = omicron.get("/")((req: omicron.HttpRequest) => {
      throw new Error("We threw an error");
    })((req: omicron.HttpRequest, error: Error) => {
      throw new Error("We threw a second error");
    });

    await getServerInstance([handler]);

    await supertest(server)
      .get("/")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "We threw a second error") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(500);

    done();
  });

  test("Handles request with async handler", async (done) => {
    // given
    const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

    const handler = omicron.get("/")(async (req: omicron.HttpRequest) => {
      await wait(1000);
      return {
        response: "It works!",
        status: 200,
        headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
      };
    })((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handler]);

    await supertest(server)
      .get("/")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "It works!") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request with async error handler", async (done) => {
    // given
    const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

    const handler = omicron.get("/")(async (req: omicron.HttpRequest) => {
      throw new Error("We threw an error");
    })(async (req: omicron.HttpRequest, error: Error) => {
      await wait(1000);
      return {
        response: error.message,
        status: 500,
        headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
      };
    });

    await getServerInstance([handler]);

    await supertest(server)
      .get("/")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "We threw an error") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(500);

    done();
  });

  test("Route matcher resolves to correct route", async (done) => {
    // given
    const handlerIndex = omicron.get("/")((req: omicron.HttpRequest) => ({
      response: "handlerIndex",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }))((req: omicron.HttpRequest, error: Error) => ({
      response: "It does not work!",
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    const handlerPathParamsGet = omicron.get("/user/:name")((req: omicron.HttpRequest) => ({
      response: "handlerPathParamsGet",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }))((req: omicron.HttpRequest, error: Error) => ({
      response: "It does not work!",
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    const handlerPathParamsPost = omicron.post("/user/:name")((req: omicron.HttpRequest) => ({
      response: "handlerPathParamsPost",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }))((req: omicron.HttpRequest, error: Error) => ({
      response: "It does not work!",
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerIndex, handlerPathParamsGet, handlerPathParamsPost]);

    await supertest(server)
      .post("/user/bob")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "handlerPathParamsPost") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .get("/user/bob")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "handlerPathParamsGet") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    await supertest(server)
      .get("/")
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "handlerIndex") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Route matcher resolves to notFound handler when no handler was found", async (done) => {
    // given
    await getServerInstance([]);

    // when
    await supertest(server)
      .post("/user/bob")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_HTML)
      .expect(function (res) {
        if (res.text === "<h1>Not Found</h1>") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(404);

    done();
  });

  test("Handles request whose handler uses middleware", async (done) => {
    // given
    const authenticatedMiddleware: omicron.Middleware = (req) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));

    const handler = () => ({
      response: "User is authenticated",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithMiddleware = omicron.get("/middleware")(
      omicron.useMiddleware([authenticatedMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request whose handler uses error throwing middleware", async (done) => {
    // given
    const authenticatedMiddleware: omicron.ErrorThrowingMiddleware = (req) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();

    const handler = () => ({
      response: "User is authenticated",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithErrorThrowingMiddleware = omicron.get("/middleware")(
      omicron.useErrorThrowingMiddleware([authenticatedMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithErrorThrowingMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request whose handler uses multiple middlewares", async (done) => {
    // given
    const authenticatedMiddleware: omicron.Middleware = (req) =>
      req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));

    const isBobMiddleware: omicron.Middleware = (req) =>
      req.query.name === "Bob" ? E.right(req) : E.left(new Error("User is not Bob"));

    const handler = () => ({
      response: "User is authenticated and his name is Bob",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithMiddleware = omicron.get("/middleware")(
      omicron.useMiddleware([authenticatedMiddleware, isBobMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15&name=Bob")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated and his name is Bob") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request whose handler uses multiple error throwing middlewares", async (done) => {
    // given
    const authenticatedMiddleware: omicron.ErrorThrowingMiddleware = (req) =>
      req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();

    const isBobMiddleware: omicron.ErrorThrowingMiddleware = (req) =>
      req.query.name === "Bob"
        ? req
        : (() => {
            throw new Error("User is not Bob");
          })();

    const handler = () => ({
      response: "User is authenticated and his name is Bob",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithErrorThrowingMiddleware = omicron.get("/middleware")(
      omicron.useErrorThrowingMiddleware([authenticatedMiddleware, isBobMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithErrorThrowingMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15&name=Bob")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated and his name is Bob") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request whose handler uses multiple async middlewares", async (done) => {
    // given
    const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

    const authenticatedMiddleware: omicron.Middleware = async (req) => {
      await wait(1000);
      return req.query.number > 10 ? E.right(req) : E.left(new Error("User not authenticated"));
    };

    const isBobMiddleware: omicron.Middleware = (req) =>
      req.query.name === "Bob" ? E.right(req) : E.left(new Error("User is not Bob"));

    const handler = () => ({
      response: "User is authenticated and his name is Bob",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithMiddleware = omicron.get("/middleware")(
      omicron.useMiddleware([authenticatedMiddleware, isBobMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15&name=Bob")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated and his name is Bob") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });

  test("Handles request whose handler uses multiple async error throwing middlewares", async (done) => {
    // given
    const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));
    const authenticatedMiddleware: omicron.ErrorThrowingMiddleware = async (req) => {
      await wait(1000);
      return req.query.number > 10
        ? req
        : (() => {
            throw new Error("User not authenticated");
          })();
    };

    const isBobMiddleware: omicron.ErrorThrowingMiddleware = (req) =>
      req.query.name === "Bob"
        ? req
        : (() => {
            throw new Error("User is not Bob");
          })();

    const handler = () => ({
      response: "User is authenticated and his name is Bob",
      status: 200,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    });

    const handlerWithErrorThrowingMiddleware = omicron.get("/middleware")(
      omicron.useErrorThrowingMiddleware([authenticatedMiddleware, isBobMiddleware])(handler)
    )((req: omicron.HttpRequest, error: Error) => ({
      response: error.message,
      status: 500,
      headers: { "Content-Type": omicron.ContentType.TEXT_PLAIN },
    }));

    await getServerInstance([handlerWithErrorThrowingMiddleware]);

    // when

    await supertest(server)
      .get("/middleware?number=15&name=Bob")
      // then
      .expect("Content-Type", omicron.ContentType.TEXT_PLAIN)
      .expect(function (res) {
        if (res.text === "User is authenticated and his name is Bob") {
          return;
        } else {
          throw new Error("Falsy response body");
        }
      })
      .expect(200);

    done();
  });
});
