import Player from "./player";
import Team from "./team";

class League {
  private _id: number;
  private _name: string;
  private _token: string;
  private _alias: string;
  private _teams: Array<Team> = new Array();
  private _players: Map<number, Player>;

  constructor(_id: number, _name: string, _alias: string , _token: string) {
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

  public addPlayer(player: Player) {
    this._players.set(player.id, player);
  }

  public removePlayers(player: Player) {
    this._players.delete(player.id);
  }
}

export default League;
