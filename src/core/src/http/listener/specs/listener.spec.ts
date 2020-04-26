import { httpListener } from "../listener";
import { HttpListenerConfig } from "../listener.interface";

describe("HTTP listener", () => {
  test("creates a HTTP listener with empty config", () => {
    // given

    // when
    const listener = httpListener();

    // then
    expect(listener).toBeDefined();
  });

  test("creates a HTTP listener with config", () => {
    // given
    const config: HttpListenerConfig = { routes: [] };
    // when
    const listener = httpListener(config);

    // then
    expect(listener).toBeDefined();
  });
});
