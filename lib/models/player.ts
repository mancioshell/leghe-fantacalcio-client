class Player {
  private _id: number;
  private _name: string;
  private _team: string;
  private _roles: Array<string>;
  private _initial_quotation: number;
  private _current_quotation: number;
  private _price?: number;

  constructor(
    _id: number = 0,
    _name: string = "",
    _team: string = "",
    _roles:  Array<string> = [],
    _initial_quotation: number = 0,
    _current_quotation: number = 0
  ) {
    this._id = _id;
    this._name = _name;
    this._team = _team;    
    this._roles = _roles;
    this._initial_quotation = _initial_quotation;
    this._current_quotation = _current_quotation;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get roles() {
    return this._roles;
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

  public toJSON(){
    return {
      id: this._id,
      name: this._name,
      team: this._team,
      roles: this._roles,
      price: this._price,
      initial_quotation: this._initial_quotation,
      current_quotation: this._current_quotation
    }
  }
}

export default Player;
