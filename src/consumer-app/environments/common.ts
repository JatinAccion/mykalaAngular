export const apiNames = {
    auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    userService: {
        createAccount: 'consumer',
        forgotPassword: 'forgotPassword',
        resetPassword: 'resetPassword',
        validateToken: 'validateToken',
        resendVerification: 'resendVerification'
    },
    profileInterest: {
        saveProfile: '',
        getCatalogue: 'consumerInterests',
        saveInterest: 'profile/addConsumerCatalogs',
        myAccountProfileImage: 'profilePic',
        myAccountEmailId: 'email',
        myAccountPassword: 'password',
        myAccountLocation: 'address',
        myAccountDOB: 'dateOfBirth',
        myAccountInterest: 'consumerInterst',
        review: 'review',
        getProductReviews: 'productReview',
        emailNotification: 'emailNotification',
        alertNotification: 'alertNotification',
        closeAccount: 'closeAccount',
        consumerOffer: 'consumerOffer',
        userReviewList: 'userReviewList',
        updateOffer: 'updateOffer',
        updateReview: 'reviewRead',
        addressList: 'addressList'
    },
    products: {
        getPlaces: 'places',
        getCategories: 'categories',
        getSubCategories: 'subCategories',
        getTypes: 'types'
    },
    getOffers: {
        confirmOffer: 'getOffersRequest',
        partial: 'partial'
    },
    geoCode: {
        key: '&key=AIzaSyDPSk91ksjR47kqdFbElVwL7eM8FgIZEHw'
    },
    consumerCheckout: {
        addCard: 'addCustomer',
        orderPayment: 'orderPayment',
        getCards: 'customerCards',
        updateCard: 'addMultipleCards',
        deleteCard: 'deleteCard',
        productQuantity: 'productQuantity',
        cancelOrder: 'cancelOrder',
        trackOrderShipment: 'trackOrderShipment',
        support: 'support/saveSupportRequest',
        shippedItems: 'shippedItems'
    },
    shippingMethod: {
        method: 'retailer/v1',
        getTax: 'tax/v1/productsTax',
        getStates: 'retailer/v1/states/name'
    }
};

export const commonMessages = {
    error404: 'Server is not available',
};

export const regexPatterns = {
    numberRegex: new RegExp('^[0-9_.-]*$'),
    textRegex: new RegExp('^[a-zA-Z 0-9_.-]*$'),
};