import { HttpRequest } from "../../../http.interface";
import { getBody } from "../router.body";
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
    expect(body.data).toEqual("works");
  });
});
