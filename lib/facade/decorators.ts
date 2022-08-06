import setCookieParser from "set-cookie-parser";
import Player from "../models/player";
import Team from "../models/team";

enum Actions {
  Release,
  Buy,
}

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
      return value;
    };
  };
}

function RefreshAuth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = async function (...params: any) {
      // @ts-ignore
      if (this._refreshInterval > 0) {
        // @ts-ignore
        if (!this._firstLogin) {
          // @ts-ignore
          this._firstLogin = true;
          setInterval(
            () => originalFn.call(this, ...params),
            // @ts-ignore
            this._refreshInterval
          );
          return originalFn.call(this, ...params);
        }
      }

      return originalFn.call(this, ...params);
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

function RetrieveTeamAndPlayer(action: Actions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = target[propertyKey];

    descriptor.value = async function (...params: any) {
      let playerId = params[0];
      let teamId = params[1];

      //@ts-ignore
      let team = this._currentLeague?.teams.find((team) => team.id === teamId);

      if (!team)
        throw new Error(`no teams founds in this league with id ${teamId}`);

      let player = new Player();

      if (action === Actions.Release) {
        player = team?.players.get(playerId);

        if (!player)
          throw new Error(
            `no player founds with id ${playerId} in team ${team.id}`
          );
      }

      if (action === Actions.Buy) {
        //@ts-ignore
        player = this._currentLeague?.players.get(playerId);

        if (!player)
          throw new Error(
            `no free player founds in this league with id ${playerId}`
          );
      }

      return originalFn.call(this, ...params, team, player);
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

export {
  CookiesHandler,
  Authenticated,
  LeagueSelected,
  RefreshAuth,
  RetrieveTeamAndPlayer,
  Actions,
};
