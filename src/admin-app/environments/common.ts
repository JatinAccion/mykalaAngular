export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    userService: {
        resetPassword: 'login/user/resetPassword',
    },
    retailers: {
        get: 'retailer',
        sellerTypes: 'retailer/sellerType',
        getShippingProfileNames: 'retailer/{retailerId}/shippingProfileName',
        changeStatus: 'retailer/changeStatus',
        getRetailerNames: 'retailer/sellerName'
    },
    retailerProfileInfo: {
        get: 'retailer/{retailerId}/profileInfo',
        save: 'retailer/profileInfo',
        delete: 'delete',
    },
    retailerPaymentInfo: {
        get: 'retailer/{retailerId}/bankDetail',
        save: 'retailer/bankDetail',
        delete: 'delete',
    },
    retailerShippingInfo: {
        get: 'retailer/{retailerId}/shippingProfile',
        save: 'retailer/shippingProfile',
        delete: 'delete',
    },
    retailerShippingNotification: {
        get: 'retailer/{retailerId}/shippingNotification',
        save: 'retailer/shippingNotification',
        delete: 'delete',
    },
    retailerShippingReturnPolicy: {
        get: 'retailer/{retailerId}/shippingReturnPolicy',
        save: 'retailer/shippingReturnPolicy',
        delete: 'delete',
    },
    retailerProduct: {
        getPlaces: 'retailer/getShippingReturnPolicy',
        getCategories: 'retailer/getShippingReturnPolicy',
        getSubCategories: 'retailer/getShippingReturnPolicy',
        getTypes: 'retailer/getShippingReturnPolicy',

        get: 'retailer/{retailerId}/productInfo',
        save: 'retailer/productInfo',
        delete: 'delete',
    },
    product: {
        get: 'products/filterBy',
        save: 'products/save',
        saveImage: 'products/saveImages',
        changeMainImage: 'products/changeMainImage',
        delete: 'products/delete',
        places: 'products/places',
        categories: 'products/categoriesList',
        subCategories: 'products/subCategoriesList',
        types: 'products/typesList'
    },

};
export const commonMessages = {
    error404: 'Server is not available',
};

