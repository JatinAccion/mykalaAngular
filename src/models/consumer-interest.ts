export class PostInterest {
    public consumerId: string;
    public consumerInterest: Array<any>;
};

export class ConsumerInterest {
    constructor(
        public consumerInterestsImageId: string,
        public consumerInterestsImageName: string
    ) { }
}