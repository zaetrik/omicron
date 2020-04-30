import { getQuery, getQueryParams } from "../router.query";

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

  test("returns {} if an error occurs", () => {
    // given

    // when
    const query = getQuery(undefined);

    // then
    expect(query).toBeDefined();
    expect(query).toEqual({});
  });

  test("getQueryParams returns ParsedUrlQuery", () => {
    // given
    const reqUrl = "/hello?name=bob";

    // when
    const queryParams = getQueryParams(reqUrl);

    // then
    expect(queryParams).toBeDefined();
    expect(queryParams.name).toEqual("bob");
  });
});
