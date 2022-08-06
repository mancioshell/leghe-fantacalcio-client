import League from "../models/league";
import Team from "../models/team";
import Player from "../models/player";

import {
  Authenticated,
  LeagueSelected,
  RefreshAuth,
  RetrieveTeamAndPlayer,
  Actions,
} from "./decorators";
import HttpClient from "./http-client";

const APP_BASE_URL = "https://appleghe.fantacalcio.it/api";
const WEB_BASE_URL = "https://leghe.fantacalcio.it";

class FantasyFootball {
  private _appKey: string;
  private _webAppKey: string;
  private _username: string;
  private _password: string;
  private _refreshInterval: number;

  private _leagues: Array<League> = new Array();
  private _token: string | undefined;
  private _currentLeague: League | undefined;

  private _httpClient: HttpClient;
  private _firstLogin: boolean;

  constructor(
    appKey: string,
    webAppKey: string,
    username: string,
    password: string,
    refreshInterval: number = -1
  ) {
    this._appKey = appKey;
    this._webAppKey = webAppKey;
    this._username = username;
    this._password = password;
    this._refreshInterval = refreshInterval;

    this._httpClient = new HttpClient();
    this._firstLogin = false;
  }

  private async _webLogin() {
    await this._httpClient.execute(
      "GET",
      `${WEB_BASE_URL}/api/v1/v1_Utente/login?s=8`,
      {
        app_key: this._appKey,
        user_token: this._token,
        lega_token: this._currentLeague!.token,
      }
    );
  }

  private async _retrieveTeams() {
    let res = await this._httpClient.execute(
      "GET",
      `${APP_BASE_URL}/v1/v1_lega/squadre`,
      {
        app_key: this._appKey,
        user_token: this._token,
        lega_token: this._currentLeague?.token,
      }
    );

    let data = JSON.parse(res.raw_body).data;
    let teams = new Array<Team>();

    data.forEach((element: any) => {
      let idPlayerList = element.cal.split(";");
      let priceList = element.cs.split(";");

      let team = new Team(element.id, element.idu, element.n);

      idPlayerList.forEach((id: string, index: number) => {
        let player = this._currentLeague!.players.get(parseInt(id));

        if (player) {
          team.addPlayer(player);
          player.price = priceList[index];
        }

        this._currentLeague!.players.delete(parseInt(id));
      });

      teams.push(team);
    });

    this._currentLeague!.teams = teams;
  }

  private async _retreivePlayers() {
    let res = await this._httpClient.execute(
      "GET",
      `${WEB_BASE_URL}/servizi/v1_legheCalciatori/listaSvincolatiAdmin?alias_lega=${this._currentLeague?.alias}&id_mercato=0&tipo_mercato=4`,
      {
        app_key: this._webAppKey,
        user_token: this._token,
        lega_token: this._currentLeague?.token,
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

    this._currentLeague!.players = players;
  }

  @RefreshAuth()
  public async login() {
    let res = await this._httpClient.execute(
      "POST",
      `${APP_BASE_URL}/v1/v1_utente/login`,
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
      this._leagues.push(
        new League(element.id, element.nome, element.alias, element.token)
      );
    });
  }

  @Authenticated()
  public async getLeagues() {
    return this._leagues;
  }

  @Authenticated()
  public async setCurrentLeague(leagueId: number) {
    let index = this._leagues.findIndex(
      (league: League) => league.id === leagueId
    );
    if (index < 0) throw new Error(`no league with ${leagueId} id`);
    this._currentLeague = this._leagues[index];

    await this._webLogin();
    await this._retreivePlayers();
    await this._retrieveTeams();
  }

  @LeagueSelected()
  @Authenticated()  
  public async getPlayerList() {
    return this._currentLeague!.players;
  }

  @LeagueSelected() 
  @Authenticated()  
  public async getTeams() {
    return this._currentLeague!.teams;
  }

  @RetrieveTeamAndPlayer(Actions.Buy)
  @LeagueSelected()
  @Authenticated()
  public async buyPlayer(
    playerId: number,
    teamId: number,
    price: number,
    team: Team = new Team(),
    player: Player = new Player()
  ) {
    let res = await this._httpClient.execute(
      "PUT",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/salva?alias_lega=${this._currentLeague?.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: price }
    );   

    this._currentLeague?.players.delete(playerId);
    player.price = price;
    team.addPlayer(player);

    let data = JSON.parse(res.raw_body);

    return data;
  }

  
  @RetrieveTeamAndPlayer(Actions.Release)
  @LeagueSelected()
  @Authenticated()
  public async releasePlayer(
    playerId: number,
    teamId: number,
    releasePrice: number,
    team: Team = new Team(),
    player: Player = new Player()
  ) {
    let res = await this._httpClient.execute(
      "DELETE",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/svincola?alias_lega=${this._currentLeague?.alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: releasePrice }
    );

    let data = JSON.parse(res.raw_body);

    player.price = undefined;
    team.removePlayer(player);
    team.addPlayer(player);

    return data;
  }
}

export default FantasyFootball;
