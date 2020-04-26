import { getPathParams } from "../router.params";

describe("Get request params", () => {
  test("parses params from request", () => {
    // given
    const routeHandlerPath = "/hello/:name";
    const reqUrl = "/hello/cedric";

    // when
    const params = getPathParams(routeHandlerPath, reqUrl);

    // then
    expect(params).toBeDefined();
    expect(params.name).toEqual("cedric");
  });
});
