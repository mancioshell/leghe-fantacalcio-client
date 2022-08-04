import setCookieParser from "set-cookie-parser";

function GenericDecorator(before: Function, next: Function) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = function (...params: any) {
      before(...params);
      let value = originalFn.call(this, ...params);
      next(...params);
      return value
    };
  };
}

function Authenticated() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = async function (...params: any) {
      //@ts-ignore
      if (!this._token) throw new Error("you aren't authenticated");
      return originalFn.call(this, ...params);
    };
  };
}

function LeagueSelected() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = async function (...params: any) {
      //@ts-ignore
      if (!this._currentLeague)
        throw new Error(
          "you need to select a league before doing any operations"
        );
      return originalFn.call(this, ...params);
    };
  };
}

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

export { CookiesHandler, Authenticated, LeagueSelected };
