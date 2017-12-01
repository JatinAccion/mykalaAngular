import { RetailerBuinessAddress } from './retailer-business-adress';
import { RetailerPrimaryContact } from './retailer-contact';

export class RetailerProfileInfo {
    public retailerId: number;
    public businessLogoPath: string;
    public businessName: string;
    public tin: string;
    public businessSummary: string;
    public sellerTypeId: number;
    public businessAdresses: Array<RetailerBuinessAddress>;

    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;

    public primaryContact: RetailerPrimaryContact;

}
