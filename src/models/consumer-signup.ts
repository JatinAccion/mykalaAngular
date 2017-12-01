import { RoleModel } from "./userRole";

export class ConsumerSignUp {
    public username: string;
    public password: string;
    public emailId: string;
    public origin_source: string;
    public user_status: number;
    public roles: RoleModel;
}