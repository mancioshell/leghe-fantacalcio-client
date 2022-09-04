import League, { LeagueOptions, Role } from "@models/league";
import Team, { TeamPackage } from "@models/team";
import Player from "@models/player";
import HttpClient from "@utils/http-client";
import User from "@models/user";

import { RetrievePlayer, Authorization } from "@utils/decorators";
import { GenericError } from "@models/errors";
import { FacadeResponse } from "@models/response";

const APP_BASE_URL = "https://appleghe.fantacalcio.it/api";
const WEB_BASE_URL = "https://leghe.fantacalcio.it";

class FantasyFootballLeagueClient {
  private _appKey: string;
  private _webAppKey: string;
  private _httpClient: HttpClient;

  constructor(appKey: string, webAppKey: string) {
    this._appKey = appKey;
    this._webAppKey = webAppKey;
    this._httpClient = new HttpClient();
  }

  private async _webLogin(
    userToken: string,
    leagueToken: string
  ): Promise<void> {
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

  private async _retrieveTeams(
    userToken: string,
    leagueToken: string
  ): Promise<Array<TeamPackage>> {
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

      let president = new User(element.idu, element.nu);

      let team = new Team(element.id, element.n, president);

      teams.push(new TeamPackage(idPlayerList, priceList, team));
    });

    return teams;
  }

  private async _retrievePlayers(
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
          element.r.split(";"),
          element.ci,
          element.ca
        )
      );
    });

    return players;
  }

  private async _retrieveLeagueOptions(
    userToken: string,
    leagueToken: string
  ): Promise<LeagueOptions> {
    let res = await this._httpClient.execute(
      "GET",
      `${APP_BASE_URL}/v1/v1_lega/opzioni`,
      {
        app_key: this._appKey,
        user_token: userToken,
        lega_token: leagueToken,
      }
    );

    let data = JSON.parse(res.raw_body).data;
    let leagueOptions = data.opzioni_rose;

    let options = new LeagueOptions(
      leagueOptions.crediti,
      leagueOptions.min_rosa,
      leagueOptions.max_rosa,
      leagueOptions.calciatori_ruolo.p,
      leagueOptions.calciatori_ruolo.d,
      leagueOptions.calciatori_ruolo.c,
      leagueOptions.calciatori_ruolo.a
    );

    return options;
  }

  private async _retrieveUserRole(
    userToken: string,
    leagueToken: string,
    id: number
  ): Promise<Role> {
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
    let currentUser = data.find((elem: any) => elem.id === id);

    let role = Role.USER;

    if (currentUser.adminSecondario) role = Role.ADMIN;
    if (currentUser.admin) role = Role.SUPER_ADMIN;

    return role;
  }

  private async _retrieveUserEmail(
    userToken: string,
    leagueToken: string,
    username: string
  ): Promise<string> {
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

    let currentUser = data.find(
      (elem: any) => elem.username.trim() === username
    );

    return currentUser ? currentUser.email : "";
  }

  public async login(username: string, password: string): Promise<User> {
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

  @Authorization()
  public async getRoleByLeagueId(
    userToken: string,
    leagueId: number
  ): Promise<Role> {
    let profile = await this._retrieveProfile(userToken);

    let currentLeague = profile.leghe.find(
      (league: any) => league.id === leagueId
    );

    let role = await this._retrieveUserRole(
      userToken,
      currentLeague.token,
      profile.utente.id
    );

    return role;
  }

  public async getLeagues(userToken: string): Promise<Array<League>> {
    let profile = await this._retrieveProfile(userToken);

    let leagues = new Array<League>();

    for (let element of profile.leghe) {
      let league = new League(
        element.id,
        element.nome,
        element.alias,
        element.token
      );

      let role = await this._retrieveUserRole(
        userToken,
        league.token,
        profile.utente.id
      );

      league.role = role;
      leagues.push(league);
    }

    return leagues;
  }

  @Authorization()
  public async getLeague(userToken: string, leagueId: number): Promise<League> {
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

    let options = await this._retrieveLeagueOptions(userToken, league.token);

    let players = await this._retrievePlayers(
      userToken,
      league.token,
      league.alias
    );

    let role = await this._retrieveUserRole(
      userToken,
      league.token,
      profile.utente.id
    );

    let packages = await this._retrieveTeams(userToken, league.token);
    let teams = new Array<Team>();

    for (const element of packages) {
      let email = await this._retrieveUserEmail(
        userToken,
        league.token,
        element.team.president.username
      );

      element.team.president.email = email;

      element.ids.forEach((id: string, index: number) => {
        let player = players.get(parseInt(id));
        if (player) {
          element.team.addPlayer(player);
          player.price = parseInt(element.prices[index]);

          players.delete(parseInt(id));
        }
      });

      teams.push(element.team);
    }

    league.players = players;
    league.teams = teams;
    league.options = options;
    league.role = role;

    return league;
  }

  @Authorization()
  @RetrievePlayer()
  public async buyPlayer(
    userToken: string,
    leagueId: number,
    playerId: number,
    teamId: number,
    price: number,
    alias?: string,
    player?: Player
  ) {
    if (player) return new FacadeResponse().toJSON();

    let res = await this._httpClient.execute(
      "PUT",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/salva?alias_lega=${alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: price }
    );

    let data = JSON.parse(res.raw_body);
    if (!data.success) throw new GenericError("buyPlayer");

    return data;
  }

  @Authorization()
  @RetrievePlayer()
  public async releasePlayer(
    userToken: string,
    leagueId: number,
    playerId: number,
    teamId: number,
    releasePrice: number,
    alias?: string,
    player?: Player
  ) {
    if (!player) return new FacadeResponse().toJSON();

    let res = await this._httpClient.execute(
      "DELETE",
      `${WEB_BASE_URL}/servizi/v1_leghemercatoOrdinarioAdmin/svincola?alias_lega=${alias}`,
      {
        app_key: this._webAppKey,
        "Content-Type": "application/json",
      },
      { id_squadra: teamId, ids: playerId, costi: releasePrice }
    );

    let data = JSON.parse(res.raw_body);
    if (!data.success) throw new GenericError("releasePlayer");

    return data;
  }
}

export default FantasyFootballLeagueClient;
