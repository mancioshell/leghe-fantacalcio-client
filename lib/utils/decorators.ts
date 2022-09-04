import setCookieParser from "set-cookie-parser";
import { LeagueNotFound, TeamNotFound } from "@models/errors";
import { TeamPackage } from "@models/team";

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

function RetrievePlayer() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = descriptor.value;
    descriptor.value = async function (...params: any[]) {
      let userToken = params[0];
      let leagueId = params[1];
      let playerId = params[2];
      let teamId = params[3];
      let currentLeague = params[4];    

      //@ts-ignore
      await this._webLogin(userToken, currentLeague.token);

      //@ts-ignore
      let teams = await this._retrieveTeams(userToken, currentLeague.token);
      let teamPackage = teams.find(
        (element: TeamPackage) => element.team.id === teamId
      );
      if (!teamPackage) throw new TeamNotFound(teamId, leagueId);

      let player = teamPackage.ids.find(
        (id: string) => parseInt(id) === playerId
      );

      let value = await originalFn.apply(this, [
        ...params,
        currentLeague.alias,
        player,
      ]); // do operation
      return value;
    };
  };
}

function Authorization() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = descriptor.value;
    descriptor.value = async function (...params: any[]) {
      let userToken = params[0];
      let leagueId = params[1];

      //@ts-ignore
      let profile = await this._retrieveProfile(userToken);
      let currentLeague = profile.leghe.find(
        (league: any) => league.id === leagueId
      );

      if (!currentLeague) throw new LeagueNotFound(leagueId);

      let value = await originalFn.apply(this, [...params, currentLeague]); // do operation
      return value;
    };
  };
}

export { CookiesHandler, RetrievePlayer, Authorization };
