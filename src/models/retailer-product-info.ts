import { IdNameParent } from './nameValue';

export class RetailerProductInfo {
    public retailerId: number;
    public places: Array<IdNameParent>;
    public categories: Array<IdNameParent>;
    public subCategories: Array<IdNameParent>;
    public productTypes: Array<IdNameParent>;

    constructor(obj?: any) {
        if (obj) {
            this.places = obj.places;
            this.categories = obj.categories;
            this.subCategories = obj.subCategories;
            this.productTypes = obj.productTypes;
        } else {
            this.places = new Array<IdNameParent>();
            this.categories = new Array<IdNameParent>();
            this.subCategories = new Array<IdNameParent>();
            this.productTypes = new Array<IdNameParent>();
        }
    }
}