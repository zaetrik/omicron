import { getQuery } from "../router.query";

describe("Get request query", () => {
  test("parses query from request", () => {
    // given
    const reqUrl = "/hello?name=bob";

    // when
    const query = getQuery(reqUrl);

    // then
    expect(query).toBeDefined();
    expect(query.name).toEqual("bob");
  });
});
