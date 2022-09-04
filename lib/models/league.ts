import Player from "./player";
import Team from "./team";

enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER"
}

class LeagueOptions {
  private _credits: number;
  private _min_players: number;
  private _max_players: number;

  private _goalkeeper: number;
  private _defenders: number;
  private _midfielders: number;
  private _strikers: number;

  constructor(
    _credits: number,
    _min_players: number,
    _max_players: number,
    _goalkeeper: number,
    _defenders: number,
    _midfielders: number,
    _strikers: number
  ) {
    this._credits = _credits;
    this._min_players = _min_players;
    this._max_players = _max_players;
    this._goalkeeper = _goalkeeper;
    this._defenders = _defenders;
    this._midfielders = _midfielders;
    this._strikers = _strikers;
  }

  public toJSON() {
    return {
      credits: this._credits,
      min_players: this._min_players,
      max_players: this._max_players,
      goalkeeper: this._goalkeeper,
      defenders: this._defenders,
      midfielders: this._midfielders,
      strikers: this._strikers,
    };
  }
}

class League {
  private _id: number;
  private _name: string;
  private _token: string;
  private _alias: string;
  private _role: Role = Role.USER;

  private _teams: Array<Team> = new Array();
  private _players: Map<number, Player>;

  private _options: LeagueOptions = new LeagueOptions(0, 0, 0, 0, 0, 0 , 0);

  constructor(_id: number, _name: string, _alias: string, _token: string) {
    this._id = _id;
    this._name = _name;
    this._alias = _alias;
    this._token = _token;
    this._players = new Map<number, Player>();
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get alias() {
    return this._alias;
  }

  public get token() {
    return this._token;
  }

  public get options() {
    return this._options;
  }

  public set options(options: LeagueOptions) {
    this._options = options;
  }

  public get teams() {
    return this._teams;
  }

  public set teams(teams: Array<Team>) {
    this._teams = teams;
  }

  public get players() {
    return this._players;
  }

  public set players(players: Map<number, Player>) {
    this._players = players;
  }

  public get role() {
    return this._role;
  }

  public set role(role: Role) {
    this._role = role;
  }

  public addPlayer(player: Player) {
    this._players.set(player.id, player);
  }

  public removePlayers(player: Player) {
    this._players.delete(player.id);
  }

  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      token: this._token,
      alias: this._alias,
      role: this._role,
      options: this._options,
      teams: this._teams,
      players: Object.fromEntries(this.players),
    };
  }
}

export default League;
export { Role, LeagueOptions, League };
