import { HttpHeaders } from "../../http.interface";

export const getContentType = (headers: HttpHeaders): string => {
  const contentType = headers["content-type"] || headers["Content-Type"];
  return contentType
    ? Array.isArray(contentType)
      ? contentType[0]
      : String(contentType)
    : "";
};
