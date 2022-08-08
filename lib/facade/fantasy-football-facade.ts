import League, { Role } from "../models/league";
import Team from "../models/team";
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

  private async _webLogin(userToken: string, leagueToken: string) {
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

  private async _retrieveTeams(
    userToken: string,
    leagueToken: string,
    players: Map<number, Player>
  ) {
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
    let teams = new Array<Team>();

    data.forEach((element: any) => {
      let idPlayerList = element.cal.split(";");
      let priceList = element.cs.split(";");

      let team = new Team(element.id, element.idu, element.n);

      idPlayerList.forEach((id: string, index: number) => {
        let player = players.get(parseInt(id));

        if (player) {
          team.addPlayer(player);
          player.price = priceList[index];
        }
      });

      teams.push(team);
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
  ) {
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

  public async login(username: string, password: string) {
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

    let leagues = new Array<League>();

    data.leghe.forEach((element: any) => {
      leagues.push(
        new League(element.id, element.nome, element.alias, element.token)
      );
    });

    for (const league of leagues) {
      let roles = await this._retreiveUserRoles(
        data.utente.utente_token,
        league.token,
        data.utente.username
      );
      league.roles = roles;
    }

    let user = new User(
      data.utente.id,
      data.utente.username,
      data.utente.email,
      data.utente.utente_token,
      leagues
    );

    return user;
  }

  public async getPlayerList(
    userToken: string,
    leagueToken: string,
    aliasLeague: string
  ) {
    return this._retreivePlayers(userToken, leagueToken, aliasLeague);
  }

  public async getTeams(
    userToken: string,
    leagueToken: string,
    aliasLeague: string
  ) {
    let players = await this._retreivePlayers(
      userToken,
      leagueToken,
      aliasLeague
    );
    return this._retrieveTeams(userToken, leagueToken, players);
  }

  public async buyPlayer(   
    userToken: string,
    leagueToken: string,
    leagueAlias: string,
    playerId: number,
    teamId: number,
    price: number
  ) {

    await this._webLogin(userToken, leagueToken)

    let res = await this._httpClient.execute(
      "PUT",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/salva?alias_lega=${leagueAlias}`,
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
    leagueToken: string,
    leagueAlias: string,
    playerId: number,
    teamId: number,
    releasePrice: number
  ) {

    await this._webLogin(userToken, leagueToken)

    let res = await this._httpClient.execute(
      "DELETE",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/svincola?alias_lega=${leagueAlias}`,
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
