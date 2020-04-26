import { createServer } from "../server";
import { httpListener } from "../../listener/listener";
import { HttpServer } from "../../../http.interface";

describe("Create Server", () => {
  let server: HttpServer;

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

  test("creates http server and starts listening", async () => {
    // given
    const app = await createServer({
      listener: httpListener(),
      port: 3000,
    });

    // when
    server = await app();

    // then
    expect(server.listening).toBe(true);
  });

  test("creates http server and starts listening without specified port", async () => {
    // given
    const app = await createServer({
      listener: httpListener(),
    });

    // when
    server = await app();

    // then
    expect(server.listening).toBe(true);
  });
});
