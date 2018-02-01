import { ConsumerAddress } from "./consumer-address";

export class PostInterest {
    public consumerInterests: Array<any>;
    public customerId: string;
    public userId: string;
    public firstName: string;
    public lastName: string;
    public address: string;
    public consumerImagePath: string;
    public phone: string;
    public email: string;
    public gender: string;
    public dateOfBirth: string;
    public customerAccountStatus: string;
};

export class ConsumerInterest {
    constructor(
        public consumerInterestsImageId: string,
        public consumerInterestsImageName: string
    ) { }
}