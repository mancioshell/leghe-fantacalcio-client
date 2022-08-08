import setCookieParser from "set-cookie-parser";

function CookiesHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = async function (...params: any) {
      //@ts-ignore
      let cookieString = Array.from(this._cookieJar.values()).join("; ");
      params[2] = { ...params[2], Cookie: cookieString };

      let value = await originalFn.call(this, ...params); // do operation

      var cookies = setCookieParser.parse(value, {
        decodeValues: true, // default: true
      });

      cookies.forEach((cookie: any) => {
        //@ts-ignore
        this._cookieJar.set(cookie.name, `${cookie.name}=${cookie.value}`);
      });

      return value;
    };
  };
}

export {
  CookiesHandler
};
