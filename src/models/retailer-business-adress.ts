export class PostalAddress {
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public email: string;
    public phoneNo: string;
    constructor(obj?: any) {
        if (obj) {
            this.addressLine1 = obj.addressLine1;
            this.addressLine2 = obj.addressLine2;
            this.city = obj.city;
            this.state = obj.state;
            this.zipcode = obj.zipcode;
            this.email = obj.email;
            this.phoneNo = obj.phoneNo;
        }
    }
}
export class RetailerBuinessAddress extends PostalAddress {
    public businessAddressId: number;
    public createdDate: Date | null;
    public modifiedDate: Date | null;
    public status: boolean | null = true;
    constructor(obj?: any) {
        super(obj);
        if (obj) {
            this.businessAddressId = obj.businessAddressId;
            this.createdDate = obj.createdDate;
            this.modifiedDate = obj.modifiedDate;
            this.status = obj.status;
        }
    }
}