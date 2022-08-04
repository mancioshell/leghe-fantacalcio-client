class Player {
  private _id: number;
  private _name: string;
  private _team: string;
  private _mantra_role: string;
  private _role: string;
  private _quotation: number;
  private _mantra_quotation: number;

  constructor(
    _id: number,
    _name: string,
    _team: string,
    _mantra_role: string,
    _role: string,
    _quotation: number,
    _mantra_quotation: number
  ) {
    this._id = _id;
    this._name = _name;
    this._team = _team;
    this._mantra_role = _mantra_role;
    this._role = _role;
    this._quotation = _quotation;
    this._mantra_quotation = _mantra_quotation;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get mantraRole() {
    return this._mantra_role;
  }

  public get role() {
    return this._role;
  }

  public get team() {
    return this._team;
  }

  public get mantra_quotation() {
    return this._mantra_quotation;
  }

  public get quotation() {
    return this._quotation;
  }
}

export default Player;
