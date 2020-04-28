import { HttpRequest } from "../../core/src/http.interface";
import * as E from "fp-ts/lib/Either";

export type Middleware = (req: HttpRequest) => E.Either<Error, HttpRequest | unknown>;
