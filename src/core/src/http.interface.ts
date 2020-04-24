import http from "http";

export interface RouteResponse {
  status?: number;
  response: any;
  contentType?: ContentType;
}

export interface PathParameters {
  [key: string]: any;
}

export interface QueryParameters {
  [key: string]: any;
}

export interface RequestBody {
  [key: string]: any;
}

export interface HttpRequest extends http.IncomingMessage {
  params?: PathParameters;
  query?: QueryParameters;
  body?: RequestBody;
}

export type HttpResponse = http.ServerResponse;

export interface HttpHeaders extends http.OutgoingHttpHeaders {}

export type HttpServer = http.Server;

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NONAUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export enum ContentType {
  APPLICATION = "application/*",
  APPLICATION_RTF = "application/rtf",
  APPLICATION_ZIP = "application/zip",
  APPLICATION_X_RAR = "application/x-rar-compressed",
  APPLICATION_X_TAR = "application/x-tar",
  APPLICATION_X_TZ_COMPRESSED = "application/x-7z-compressed",
  APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded",
  APPLICATION_PDF = "application/pdf",
  APPLICATION_JSON = "application/json",
  APPLICATION_JAVASCRIPT = "application/javascript",
  APPLICATION_ECMASCRIPT = "application/ecmascript",
  APPLICATION_XML = "application/xml",
  APPLICATION_OCTET_STREAM = "application/octet-stream",
  APPLICATION_VND_API_JSON = "application/vnd.api+json",
  TEXT_PLAIN = "text/plain",
  TEXT_HTML = "text/html",
  TEXT_CSS = "text/css",
  TEXT_CSV = "text/csv",
  IMAGE_WEBP = "image/webp",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
  IMAGE_GIF = "image/gif",
  IMAGE_TIFF = "image/tiff",
  IMAGE_SVG_XML = "image/svg+xml",
  AUDIO_MPEG = "audio/mpeg",
  AUDIO_OGG = "audio/ogg",
  AUDIO = "audio/*",
  VIDEO_WEBM = "video/webm",
  VIDEO_MP4 = "video/mp4",
  FONT_TTF = "font/ttf",
  FONT_WOFF = "font/woff",
  FONT_WOFF2 = "font/woff2",
  MULTIPART_FORM_DATA = "multipart/form-data",
}

export enum HttpMethodType {
  POST,
  PUT,
  PATCH,
  GET,
  HEAD,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  "*",
}
export type HttpMethod = keyof typeof HttpMethodType;
