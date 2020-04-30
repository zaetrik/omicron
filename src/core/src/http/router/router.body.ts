import { Readable } from "stream";
import { HttpRequest, RequestBody } from "../../http.interface";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";

export const getBody = async (req: HttpRequest): Promise<E.Either<Error, RequestBody>> =>
  pipe(
    await fromReadableStream(req),
    E.chain(
      // body Buffer[] to string, then JSON.parse with the string
      flow(String, (body) => E.tryCatch(() => JSON.parse(body), E.toError))
    )
  );

export const fromReadableStream = (stream: Readable): Promise<E.Either<Error, Buffer[]>> => {
  stream.pause();
  return new Promise((resolve) => {
    const data: any[] = [];
    const next = (chunk: unknown) => data.push(chunk);
    const complete = () => {
      stream.removeListener("data", next);
      stream.removeListener("error", error);
      stream.removeListener("end", complete);
      resolve(E.right(data));
    };
    const error = (err: Error) => resolve(E.left(err));

    stream.on("data", next).on("error", error).on("end", complete).resume();
  });
};
