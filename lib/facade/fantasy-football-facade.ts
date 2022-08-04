import unirest from "unirest";

import League from "../models/league";
import Team from "../models/team";
import Player from "../models/player";

import { CookiesHandler, Authenticated, LeagueSelected } from "./decorators";

const APP_BASE_URL = "https://appleghe.fantacalcio.it/api";
const WEB_BASE_URL = "https://leghe.fantacalcio.it";

class FantasyFootball {
  private _appKey: string;
  private _webAppKey: string;
  private _username: string;
  private _password: string;
  private _cookieJar: Map<string, object> = new Map<string, object>();

  private _leagues: Array<League> = new Array();
  private _token: string | undefined;
  private _currentLeague: League | undefined;

  constructor(
    appKey: string,
    webAppKey: string,
    username: string,
    password: string
  ) {
    this._appKey = appKey;
    this._webAppKey = webAppKey;
    this._username = username;
    this._password = password;
  }

  @CookiesHandler()
  private async execute(
    method: string,
    path: string,
    headers: object = {},
    body: object | undefined = undefined,
    web: boolean = false
  ) {
    let basePath = web ? WEB_BASE_URL : APP_BASE_URL;
    let data = body ? JSON.stringify(body) : null;
    let result = await unirest(method, `${basePath}${path}`, headers)
      .followRedirect(false)
      .send(data);

    return result;
  }

  public async login() {
    let res = await this.execute(
      "POST",
      "/v1/v1_utente/login",
      {
        app_key: this._appKey,
        "Content-Type": "application/json",
      },
      {
        username: this._username,
        password: this._password,
      }
    );

    let data = JSON.parse(res.raw_body).data;
    this._token = data.utente.utente_token;

    data.leghe.forEach((element: any) => {
      this._leagues.push(new League(element.id, element.nome, element.alias, element.token));
    });
  }

  @Authenticated()
  public async getLeagues() {
    return this._leagues;
  }

  @LeagueSelected()
  public async getTeams() {
    let res = await this.execute("GET", "/v1/v1_lega/squadre", {
      app_key: this._appKey,
      user_token: this._token,
      lega_token: this._currentLeague?.token,
    });

    let data = JSON.parse(res.raw_body).data;

    let teams = new Array<Team>();

    data.forEach((element: any) => {
      teams.push(
        new Team(element.id, element.idu, element.n)
      );
    });

    this._currentLeague!.teams = teams
    return this._currentLeague?.teams;
  }

  @LeagueSelected()
  public async getReleasedList() {
    let res = await this.execute(
      "GET",
      `/servizi/v1_legheCalciatori/listaSvincolatiAdmin?alias_lega=${this._currentLeague?.alias}`,
      {
        app_key: this._webAppKey,
        user_token: this._token,
        lega_token: this._currentLeague?.token,
      },
      undefined,
      true
    );

    let data = JSON.parse(res.raw_body).data;
    let releasedList = new Array<Player>();

    data.forEach((element: any) => {
      releasedList.push(
        new Player(
          element.id,
          element.n,
          element.s,
          element.r_ma,
          element.r_f,
          element.ca_f,
          element.ca_ma
        )
      );
    });

    this._currentLeague!.releasedPlayerList = releasedList

    return this._currentLeague!.releasedPlayerList;
  }

  @LeagueSelected()
  public async buyPlayer(playerId: number, teamId: number, price: number) {
    let res = await this.execute(
      "PUT",
      `/servizi/v1_leghemercatoOrdinarioAdmin/salva?alias_lega=${this._currentLeague?.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: price },
      true
    );

    let data = JSON.parse(res.raw_body);
    return data;
  }

  @LeagueSelected()
  public async releasePlayer(
    playerId: number,
    teamId: number,
    releasePrice: number
  ) {
    let res = await this.execute(
      "DELETE",
      `/servizi/v1_leghemercatoOrdinarioAdmin/svincola?alias_lega=${this._currentLeague?.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: releasePrice },
      true
    );

    let data = JSON.parse(res.raw_body);
    return data;
  }

  @Authenticated()
  public async setCurrentLeague(leagueId: number) {
    let index = this._leagues.findIndex(
      (league: League) => league.id === leagueId
    );
    if (index < 0) throw new Error(`no league with ${leagueId} id`);
    this._currentLeague = this._leagues[index];

    let res = await this.execute(
      "GET",
      "/api/v1/v1_Utente/login?s=8",
      {
        app_key: this._appKey,
        user_token: this._token,
        lega_token: this._currentLeague.token,
      },
      undefined,
      true
    );
  }
}

export default FantasyFootball;
