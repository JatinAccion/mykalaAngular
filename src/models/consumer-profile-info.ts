import { ConsumerAddress } from "./consumer-address";

export class ConsumerProfileInfo {
    public userName: string;
    public firstName: string;
    public lastName: string;
    public consumerImagePath: string;
    public phoneNo: string;
    public email: string;
    public gender: string;
    public dob: string;
    public status: string;
    public createdBy: string;
    public modifiedBy: string;
    public consumerAddress: ConsumerAddress;
}
