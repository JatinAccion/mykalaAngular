export class MyAccountProfileModel {
    public emailId: string;
    public profilePic: string;
}

export class MyAccountEmailModel {
    public oldEmailId: string;
    public newEmailId: string;
}

export class MyAccountPasswordModel {
    public emailId: string;
    public password: string;
}

export class MyAccountAddressModel {
    public emailId: string;
    public address: Array<any>;
}

export class MyAccountDOBModel {
    public emailId: string;
    public dateOfBirth: Date;
    public stringDateOfBirth?: string;
}

export class MyAccountInterestModel {
    public emailId: string;
    public consumerInterests: Array<any>;
}