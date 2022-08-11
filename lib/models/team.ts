import Player from "../models/player";
import User from "./user";

class Team {
  private _id: number;
  private _name: string;

  private _president : User
  private _players: Map<number, Player> = new Map();

  constructor(_id: number,  _name: string, _president: User) {
    this._id = _id;
    this._name = _name;
    this._president = _president;    
  }

  public get id() {
    return this._id;
  }

  public get president() {
    return this._president;
  }

  public set president(president: User) {
    this._president = president;
  }

  public get name() {
    return this._name;
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

  public removePlayer(player: Player) {
    this._players.delete(player.id);
  }

  public toJSON(){
    return {
      id: this._id,
      president: this._president,
      name: this._name,
      players: Object.fromEntries(this.players)
    }
  }
}

class TeamPackage {
  private _ids: Array<string>;
  private _prices: Array<string>;
  private _team: Team;

  constructor(_ids: Array<string>, _prices: Array<string>, _team: Team) {
    this._ids = _ids;
    this._prices = _prices;
    this._team = _team;
  }

  public get ids() {
    return this._ids;
  }

  public get prices() {
    return this._prices;
  }

  public get team() {
    return this._team;
  }
}

export default Team;
export { Team, TeamPackage };
