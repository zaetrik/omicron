import { r } from "./handler.request";

export const post = (path: string) => r(path)("POST");
export const all = (path: string) => r(path)("*");
export const get = (path: string) => r(path)("GET");
export const dlt = (path: string) => r(path)("DELETE");
export const put = (path: string) => r(path)("PUT");
export const patch = (path: string) => r(path)("PATCH");
export const options = (path: string) => r(path)("OPTIONS");
//export const connect = (path: string) => r(path)("CONNECT");
export const trace = (path: string) => r(path)("TRACE");
//export const head = (path: string) => r(path)("HEAD");
