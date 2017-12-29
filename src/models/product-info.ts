export class ProductInfo {
}
export class ProductPlace {
    public PlaceId: string;
    public PlaceName: string;
    constructor(obj?: any) {
        if (obj) {
            this.PlaceId = obj.PlaceId;
            this.PlaceName = obj.PlaceName;
        }
    }
}
export class ProductCategory extends ProductPlace {
    public CategoryId: string;
    public CategoryName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.CategoryId = obj.CategoryId;
            this.CategoryName = obj.CategoryName;
        }
    }
}
export class ProductSubCategory extends ProductCategory {
    public SubCategoryId: string;
    public SubCategoryName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.SubCategoryId = obj.SubCategoryId;
            this.SubCategoryName = obj.SubCategoryName;
        }
    }
}
export class ProductType extends ProductSubCategory {
    public TypeId: string;
    public TypeName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.TypeId = obj.TypeId;
            this.TypeName = obj.TypeName;
        }
    }
}
