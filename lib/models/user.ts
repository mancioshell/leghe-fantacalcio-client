class User {
  private _id: number;
  private _username: string;
  private _email: string;
  private _superAdmin: boolean = false;
  private _admin: boolean = false;

  constructor(_id: number = 0, _username: string = "", _email: string = "") {
    this._id = _id;
    this._username = _username;
    this._email = _email;
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
