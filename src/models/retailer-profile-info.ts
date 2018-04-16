import { RetailerBusinessAddress, PostalAddress } from './retailer-business-adress';
import { RetailerContact } from './retailer-contact';
import { environment } from '../admin-app/environments/environment';
import { AddressType } from './address-type';

export class RetailerProfileInfo {
    public retailerId: string;
    public businessName: string;
    public businessLogoPath: string;
    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;
    public tin: string;
    public businessSummary: string;
    public sellerTypeId: string;
    public createdDate: Date | null;
    public modifiedDate: Date | null;
    public status: boolean | null = true;

    public businessAddress: RetailerBusinessAddress;
    public contactPerson: RetailerContact[];
    public addresses: PostalAddress[];
    public primaryContact: RetailerContact;
    public retailerOtherInfo: RetailerOtherInfo;
    constructor(obj?: any) {
        this.addresses = new Array<PostalAddress>();
        this.businessAddress = new RetailerBusinessAddress();
        this.contactPerson = new Array<RetailerContact>();
        this.primaryContact = new RetailerContact();
        if (obj) {
            this.retailerId = obj.retailerId;
            this.businessName = obj.businessName;
            if (obj.businessLogoPath) {
                this.businessLogoPath = environment.s3 + obj.businessLogoPath;
            } else {
                delete this.businessLogoPath;
            }
            this.websiteUrl = obj.websiteUrl;
            this.websiteUserName = obj.websiteUserName;
            this.websitePassword = obj.websitePassword;
            this.tin = obj.tin;
            this.businessSummary = obj.businessSummary;
            this.sellerTypeId = obj.sellerTypeId;
            this.createdDate = obj.createdDate;
            this.modifiedDate = obj.modifiedDate;
            this.status = obj.status;
            if (obj.addresses && obj.addresses.length > 0) {
                this.addresses = obj.addresses.map(p => new PostalAddress(p));
                if (this.addresses.filter(p => p.addressType === AddressType.business).length > 0) {
                    this.businessAddress = new RetailerBusinessAddress(this.addresses.filter(p => p.addressType === AddressType.business)[0]);
                }
                if (this.addresses.filter(p => p.addressType === AddressType.primary).length > 0) {
                    this.primaryContact = new RetailerContact(this.addresses.filter(p => p.addressType === AddressType.primary)[0]);
                }
                if (this.addresses.filter(p => p.addressType !== AddressType.business).length > 0) {
                    this.contactPerson = this.addresses.filter(p => p.addressType !== AddressType.business).map(p => new RetailerContact(p));
                }
            }
            this.retailerOtherInfo = new RetailerOtherInfo(obj.retailerOtherInfo);
        }
    }

}
export class RetailerOtherInfo {
    private totalProducts: number;
    private totalTransactions: number;
    private totalReturns: number;
    private totalOffers: number;
    private totalComplaints: number;
    constructor(obj?: any) {
        if (obj) {
            this.totalProducts = obj.totalProducts;
            this.totalTransactions = obj.totalTransactions;
            this.totalReturns = obj.totalReturns;
            this.totalOffers = obj.totalOffers;
            this.totalComplaints = obj.totalComplaints;
        }
    }
}
