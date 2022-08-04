class Team {
  private _id: number;
  private _userId: number;
  private _name: string;

  constructor(_id: number, _userId: number, _name: string) {
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
}

export default Team;
