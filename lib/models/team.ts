import Player from "../models/player";

class Team {
  private _id: number;
  private _userId: number;
  private _name: string;
  private _players: Map<number, Player> = new Map();

  constructor(_id: number = 0, _userId: number = 0, _name: string = "") {
    this._id = _id;
    this._userId = _userId;
    this._name = _name;
  }

  public get id() {
    return this._id;
  }

  public get userId() {
    return this._userId;
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
}

export default Team;
