import { HttpRequest, RequestBody } from "../../../http.interface";
import { getBody, fromReadableStream } from "../router.body";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import { Readable } from "stream";

const MockReq = require("mock-req");

describe("Get request body", () => {
  test("parses body from request", async () => {
    // given
    const req = new MockReq({ method: "POST" }); // we need to set method to POST
    req.write({
      data: "works",
    });
    req.end();

    // when
    const body = await getBody(req as HttpRequest);

    // then
    expect(body).toBeDefined();
    expect(body._tag).toEqual("Right");
    expect(
      pipe(
        body,
        E.getOrElse((e) => ({ data: "" } as RequestBody))
      ).data
    ).toEqual("works");
  });

  test("turns readable stream into string", async () => {
    // given
    const req = new MockReq({ method: "POST" }); // we need to set method to POST
    req.write({
      data: "works",
    });
    req.end();

    // when
    const body = await fromReadableStream(req as HttpRequest);

    // then
    expect(body).toBeDefined();
    expect(body._tag).toEqual("Right");

    pipe(
      body,
      E.map((res) =>
        expect(String(res)).toEqual(
          JSON.stringify({
            data: "works",
          })
        )
      )
    );
  });

  test("fromReadableStream returns E.Left on error", async () => {
    // given
    const readable = Readable.from("my readable stream");
    readable.destroy(new Error("My error"));

    // when
    const body = await fromReadableStream(readable);

    // then
    expect(body).toBeDefined();
    expect(body._tag).toEqual("Left");
    pipe(
      body,
      E.mapLeft((e) => expect(e.message).toEqual("My error"))
    );
  });
});
