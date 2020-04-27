import { HttpRequest, RequestBody } from "../../../http.interface";
import { getBody } from "../router.body";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";

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
});
