export class User {
  public firstName: string;
  public lastName: string;
  constructor(public email?: string, public username?: string, public password?: string) { }
}

export class BasicAuth {
  public grant_type = 'password';
  public client_id = 'mykala';
  private password = 'secret';
  public encoded: string;
  constructor() {
    this.encoded = btoa(`${this.client_id}:${this.password}`);
  }

}

export class UserProfile {

  private userId: string;
  private username: string;
  private password: string;
  private firstname: string;
  private lastname: string;
  private email: string;
  private phone: string;
  private roleType: string;
  private show: boolean;
  constructor(obj?: any) {
    if (obj) {
      this.userId = obj.userId;
      this.username = obj.username;
      this.password = obj.password;
      this.firstname = obj.firstname;
      this.lastname = obj.lastname;
      this.email = obj.email;
      this.phone = obj.phone;
      this.roleType = obj.roleType;
      this.show = false;
    }
  }
}