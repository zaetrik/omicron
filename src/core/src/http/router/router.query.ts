import { parse } from "url";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import { QueryParameters } from "../../http.interface";

export const getQuery = (reqUrl: string | undefined | null): QueryParameters =>
  pipe(
    O.fromNullable(reqUrl),
    O.map(getQueryParams),
    O.getOrElse(() => ({} as QueryParameters))
  );

const getQueryParams = (reqUrl: string) => parse(reqUrl, true).query;
