import Player from "./player";
import Team from "./team";

class League {
  private _id: number;
  private _name: string;
  private _token: string;
  private _alias: string;
  private _teams: Array<Team> = new Array();
  private _releasedPlayerList: Array<Player> = new Array();

  constructor(_id: number, _name: string, _alias: string , _token: string) {
    this._id = _id;
    this._name = _name;
    this._alias = _alias;
    this._token = _token;
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

  public get releasedPlayerList() {
    return this._releasedPlayerList;
  }

  public set teams(teams: Array<Team>) {
    this._teams = teams;
  }

  public set releasedPlayerList(playerList: Array<Player>) {
    this._releasedPlayerList = playerList;
  }
}

export default League;
