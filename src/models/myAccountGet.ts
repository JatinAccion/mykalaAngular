export class MyAccountGetModel {
    userId: string;
    userData = new MyAccountUserData();
    profileInfo = new MyaccountProfileInfo();
}

export class MyAccountUserData {
    emailId: string;
    password: string;
}

export class MyaccountProfileInfo {
    firstName: string;
    lastName: string;
    consumerImagePath: string;
    gender: string;
    birthDate: string;
    birthMonth: string;
    birthYear: string;
    address: {
        addID: string;
        addressLineOne: string;
        addressLineTwo: string;
        city: string;
        state: string;
        zipcode: string;
        addressType: string;
    }
    consumerInterests: Array<MyAccountConsumerInterest>;
}

export class MyAccountConsumerInterest {
    constructor(
        public id: string,
        public consumerInterestImageName: string,
        public consumerInterestImagePath: string
    ) { }
}