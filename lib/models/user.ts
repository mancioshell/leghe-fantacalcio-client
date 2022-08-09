import League from "./league";

class User {
  private _id: number;
  private _username: string;
  private _email: string;
  private _token: string;
  // private _leagues: Array<League>;

  // private _superAdmin: boolean = false;
  // private _admin: boolean = false;

  constructor(_id: number = 0, _username: string = "", _email: string = "", _token: string = "") {
    this._id = _id;
    this._username = _username;
    this._email = _email;
    this._token = _token;  
  }

  public get id() {
    return this._id;
  }

  public get username() {
    return this._username;
  }

  public get email() {
    return this._email;
  }

  public get token() {
    return this._token;
  }  
}

export default User;
