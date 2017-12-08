export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token'
    }
};

export const commonMessages = {
    error404: 'Server is not available',
};

export const regexPatterns = {
    numberRegex: new RegExp('^[0-9_.-]*$'),
    textRegex: new RegExp('^[a-zA-Z 0-9_.-]*$'),
};