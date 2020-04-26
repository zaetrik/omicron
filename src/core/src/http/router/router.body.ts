import { Readable } from "stream";
import { HttpRequest, RequestBody } from "../../http.interface";

// @TODO => Rewrite to return monad
export const getBody = async (req: HttpRequest): Promise<RequestBody> =>
  JSON.parse((await fromReadableStream(req)).toString());

const fromReadableStream = (stream: Readable): Promise<any[]> => {
  stream.pause();
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    const next = (chunk: unknown) => data.push(chunk);
    const complete = () => {
      stream.removeListener("data", next);
      stream.removeListener("error", error);
      stream.removeListener("end", complete);
      resolve(data);
    };
    const error = (err: Error) => reject(err);

    stream.on("data", next).on("error", error).on("end", complete).resume();
  });
};