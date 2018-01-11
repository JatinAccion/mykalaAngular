import { PostalAddress } from './retailer-business-adress';

export class RetailerContact extends PostalAddress {
    public contactPersonId: number;
    public retailerId: number;
    public personName: string;
    public position: string;
    public contactType: string;
    public createdDate: Date | null;
    public modifiedDate: Date | null;
    public status: boolean | null = true;
    constructor(obj?: any) {
        super(obj);
        if (obj) {
            this.retailerId = obj.retailerId;
            this.contactPersonId = obj.contactPersonId;
            this.personName = obj.personName;
            this.position = obj.position;
            this.contactType = obj.contactType;
            this.createdDate = obj.createdDate;
            this.modifiedDate = obj.modifiedDate;
            this.status = obj.status;
        }
    }
}
