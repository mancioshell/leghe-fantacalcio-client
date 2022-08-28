class FacadeResponse {
  private state: number = 0;
  private success: boolean = true;
  private error_msgs: Array<any> | null = null;
  private token: string = "";
  private update: boolean = true;

  constructor() {}

  public toJSON() {
    return {
      id: this.state,
      name: this.success,
      token: this.error_msgs,
      alias: this.token,
      role: this.update,
    };
  }
}

export default FacadeResponse;
export { FacadeResponse };
