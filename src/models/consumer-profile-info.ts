import { ConsumerAddress } from "./consumer-address";

export class ConsumerProfileInfo {
    public userId: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public consumerImagePath: string;
    public gender: string;
    public dateOfBirth: string;
    public consumerAddress: ConsumerAddress;
}
