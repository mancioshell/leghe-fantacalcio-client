class User {
  private _id: number;
  private _username: string;
  private _email?: string;
  private _token?: string;

  constructor(
    _id: number,
    _username: string,
    _email?: string,
    _token?: string
  ) {
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

  public set email(email: string | undefined) {
    this._email = email;
  }

  public get token() {
    return this._token;
  }

  public toJSON() {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      token: this._token,
    };
  }
}

export default User;
export { User };
