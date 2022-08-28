import unirest from "unirest";
import { CookiesHandler } from "./decorators";

class HttpClient {
  private _cookieJar: Map<string, object> = new Map<string, object>();

  constructor() {}

  @CookiesHandler()
  public async execute(
    method: string,
    url: string,
    headers: object = {},
    body: object | undefined = undefined
  ) {
    let data = body ? JSON.stringify(body) : null;
    let result = await unirest(method, `${url}`, headers)
      .followRedirect(false)
      .send(data);

    return result;
  }
}

export default HttpClient
