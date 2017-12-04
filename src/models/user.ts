export class User {
  constructor(public email?: string, public username?: string, public password?: string) { }
}

export class BasicAuth {
  public grant_type = 'password';
  public client_id= 'mykala';
  private password= 'secret';
  public encoded: string;
  constructor() {
    this.encoded = btoa(`${this.client_id}:${this.password}`);
  }

}
