export const regexPatterns = {
    numberRegex: new RegExp('^[0-9_.-]*$'),
    numberValueRegex: new RegExp('^[0-9.-]*$'),
    textRegex: new RegExp("^[a-zA-Z 0-9_.!@#$%^&*'\\(\\)\\[\\]\\{\\}\\:\\;\\<\\>\\?\\,=+\\|-]*$"),
    nameRegex: new RegExp("^[a-zA-Z 0-9_.'-\]*$"),
    emailRegex: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]+[a-zA-Z0-9]{2,4}$')
};
