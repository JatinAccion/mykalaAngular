import { ConsumerAddress } from "./consumer-address";

export class ConsumerProfileInfo {
    public userId: string;
    public emailId: string;
    public firstName: string;
    public lastName: string;
    public fullName: string;
    public consumerImagePath: string;
    public gender: string;
    public dateOfBirth: string;
    public address: Array<ConsumerAddress>;
}
