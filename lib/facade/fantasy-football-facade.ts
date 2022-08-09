import League, { Role } from "../models/league";
import Team, { TeamPackage } from "../models/team";
import Player from "../models/player";

import HttpClient from "./http-client";
import User from "../models/user";

const APP_BASE_URL = "https://appleghe.fantacalcio.it/api";
const WEB_BASE_URL = "https://leghe.fantacalcio.it";

class FantasyFootball {
  private _appKey: string;
  private _webAppKey: string;
  private _httpClient: HttpClient;

  constructor(appKey: string, webAppKey: string) {
    this._appKey = appKey;
    this._webAppKey = webAppKey;
    this._httpClient = new HttpClient();
  }

  private async _webLogin(userToken: string, leagueToken: string): Promise<void> {
    await this._httpClient.execute(
      "GET",
      `${WEB_BASE_URL}/api/v1/v1_Utente/login?s=8`,
      {
        app_key: this._appKey,
        user_token: userToken,
        lega_token: leagueToken,
      }
    );
  }

  private async _retrieveProfile(userToken: string): Promise<any> {
    let res = await this._httpClient.execute(
      "GET",
      `${APP_BASE_URL}/v1/v1_utente/profilo`,
      {
        app_key: this._appKey,
        user_token: userToken,
      }
    );
    let data = JSON.parse(res.raw_body).data;
    return data;
  }

  private async _retrieveTeams(userToken: string, leagueToken: string) : Promise<Array<TeamPackage>> {
    let res = await this._httpClient.execute(
      "GET",
      `${APP_BASE_URL}/v1/v1_lega/squadre`,
      {
        app_key: this._appKey,
        user_token: userToken,
        lega_token: leagueToken,
      }
    );

    let data = JSON.parse(res.raw_body).data;
    let teams = new Array<TeamPackage>();

    data.forEach((element: any) => {
      let idPlayerList = element.cal.split(";");
      let priceList = element.cs.split(";");

      let team = new Team(element.id, element.idu, element.n);

      teams.push(new TeamPackage(idPlayerList, priceList, team));
    });

    return teams;
  }

  private async _retreivePlayers(
    userToken: string,
    leagueToken: string,
    aliasLeague: string
  ): Promise<Map<number, Player>> {
    await this._webLogin(userToken, leagueToken);

    let res = await this._httpClient.execute(
      "GET",
      `${WEB_BASE_URL}/servizi/v1_legheCalciatori/listaSvincolatiAdmin?alias_lega=${aliasLeague}&id_mercato=0&tipo_mercato=4`,
      {
        app_key: this._webAppKey,
        user_token: userToken,
        lega_token: leagueToken,
      }
    );

    let data = JSON.parse(res.raw_body).data;
    let players = new Map<number, Player>();

    data.forEach((element: any) => {
      players.set(
        parseInt(element.id),
        new Player(
          element.id,
          element.n,
          element.s,
          element.r,
          element.ci,
          element.ca
        )
      );
    });

    return players;
  }

  private async _retreiveUserRoles(
    userToken: string,
    leagueToken: string,
    username: string
  ): Promise<Array<Role>> {
    let res = await this._httpClient.execute(
      "GET",
      `${APP_BASE_URL}/v1/V2_Lega/invitiAccettati`,
      {
        app_key: this._appKey,
        user_token: userToken,
        lega_token: leagueToken,
      }
    );

    let data = JSON.parse(res.raw_body).data;

    let currentUser = data.find((elem: any) => elem.username === username);

    let roles = new Array<Role>();
    roles.push(Role.USER);

    if (currentUser.adminSecondario) roles.push(Role.ADMIN);
    if (currentUser.admin) roles.push(Role.SUPER_ADMIN);

    return roles;
  }

  public async login(username: string, password: string) : Promise<User> {
    let res = await this._httpClient.execute(
      "POST",
      `${APP_BASE_URL}/v1/v1_utente/login`,
      {
        app_key: this._appKey,
        "Content-Type": "application/json",
      },
      {
        username: username,
        password: password,
      }
    );

    let data = JSON.parse(res.raw_body).data;

    let user = new User(
      data.utente.id,
      data.utente.username,
      data.utente.email,
      data.utente.utente_token
    );

    return user;
  }

  public async getLeagues(userToken: string) : Promise<Array<League>>{
    let profile = await this._retrieveProfile(userToken);

    let leagues = new Array<League>();

    profile.leghe.forEach((element: any) => {
      let league = new League(
        element.id,
        element.nome,
        element.alias,
        element.token
      );
      leagues.push(league);
    });

    return leagues;
  }

  public async getRolesByLeague(userToken: string, leagueId: number): Promise<Array<Role>> {
    let profile = await this._retrieveProfile(userToken);

    let leagueToken = profile.leghe.find(
      (league: any) => league.id === leagueId
    )?.token;

    let roles = await this._retreiveUserRoles(
      userToken,
      leagueToken,
      profile.utente.username
    );

    return roles;
  }

  public async getLeague(userToken: string, leagueId: number) : Promise<League> {
    let profile = await this._retrieveProfile(userToken);

    let currentLeague = profile.leghe.find(
      (league: any) => league.id === leagueId
    );
    let league = new League(
      currentLeague.id,
      currentLeague.nome,
      currentLeague.alias,
      currentLeague.token
    );

    let players = await this._retreivePlayers(
      userToken,
      league.token,
      league.alias
    );

    let packages = await this._retrieveTeams(userToken, league.token);
    let teams = new Array<Team>()

    packages.forEach((element: TeamPackage) => {

      element.ids.forEach((id: string, index: number) => {
        let player = players.get(parseInt(id));
        if (player) {
          element.team.addPlayer(player);
          player.price = parseInt(element.prices[index]);

          players.delete(parseInt(id));
        }
      });

      teams.push(element.team)
    });

    league.players = players;
    league.teams = teams;

    return league;
  }

  public async buyPlayer(
    userToken: string,
    leagueId: number,
    playerId: number,
    teamId: number,
    price: number
  ) {

    let profile = await this._retrieveProfile(userToken);
    let currentLeague = profile.leghe.find(
      (league: any) => league.id === leagueId
    );

    await this._webLogin(userToken, currentLeague.token);

    let res = await this._httpClient.execute(
      "PUT",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/salva?alias_lega=${currentLeague.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: price }
    );

    let data = JSON.parse(res.raw_body);

    return data;
  }

  public async releasePlayer(
    userToken: string,
    leagueId: number,
    playerId: number,
    teamId: number,
    releasePrice: number
  ) {

    let profile = await this._retrieveProfile(userToken);
    let currentLeague = profile.leghe.find(
      (league: any) => league.id === leagueId
    );

    await this._webLogin(userToken, currentLeague.token);

    let res = await this._httpClient.execute(
      "DELETE",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/svincola?alias_lega=${currentLeague.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: releasePrice }
    );

    let data = JSON.parse(res.raw_body);

    return data;
  }
}

export default FantasyFootball;
