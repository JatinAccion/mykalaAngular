export const apiNames = {
    auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    userService: {
        createAccount: 'login/user',
        forgotPassword: 'login/user/forgotPassword',
        resetPassword: 'login/user/resetPassword',
        validateToken: 'login/validateToken'
    },
    profileInterest: {
        saveProfile: 'profile/userDetail',
        getCatalogue: 'profile/getCatalogs',
        saveInterest: 'profile/addConsumerCatalogs'
    },
    products: {
        getPlaces: 'places',
        getCategories: 'categories',
        getSubCategories: 'subCategories',
        getTypes: 'types'
    },
    geoCode: {
        key: '&key=AIzaSyDPSk91ksjR47kqdFbElVwL7eM8FgIZEHw'
    }
};

export const commonMessages = {
    error404: 'Server is not available',
};

export const regexPatterns = {
    numberRegex: new RegExp('^[0-9_.-]*$'),
    textRegex: new RegExp('^[a-zA-Z 0-9_.-]*$'),
};