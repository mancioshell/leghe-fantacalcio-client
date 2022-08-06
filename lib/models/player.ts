class Player {
  private _id: number;
  private _name: string;
  private _team: string;
  private _role: string;
  private _initial_quotation: number;
  private _current_quotation: number;
  private _price: number | undefined;

  constructor(
    _id: number = 0,
    _name: string = "",
    _team: string = "",
    _role: string = "",
    _initial_quotation: number = 0,
    _current_quotation: number = 0
  ) {
    this._id = _id;
    this._name = _name;
    this._team = _team;    
    this._role = _role;
    this._initial_quotation = _initial_quotation;
    this._current_quotation = _current_quotation;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get role() {
    return this._role;
  }

  public get team() {
    return this._team;
  } 

  public get initialQuotation() {
    return this._initial_quotation;
  }

  public get currentQuotation() {
    return this._current_quotation;
  }

  public get price() {
    return this._price;
  }

  public set price(price: number | undefined) {
    this._price = price
  }
}

export default Player;
