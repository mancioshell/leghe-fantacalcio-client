import League from "./league";

class User {
  private _id: number;
  private _username: string;
  private _email: string;
  private _token: string;
  private _leagues: Array<League>;

  private _superAdmin: boolean = false;
  private _admin: boolean = false;

  constructor(_id: number = 0, _username: string = "", _email: string = "", _token: string = "", _leagues: Array<League>) {
    this._id = _id;
    this._username = _username;
    this._email = _email;
    this._token = _token;
    this._leagues = _leagues;
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

  public get leagues() {
    return this._leagues;
  }

  public get superAdmin() {
    return this._superAdmin;
  }

  public get admin() {
    return this._admin;
  }

  public set superAdmin(isSuperAdmin: boolean) {
    this._superAdmin = isSuperAdmin;
  }

  public set admin(isAdmin: boolean) {
    this._admin = isAdmin;
  }
}

export default User;
