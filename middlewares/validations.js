/* ===== Global Validations ===== */
function validateInputs(...inputs) {
    return inputs.every(input => Boolean(input));
}

/* ===== User Validations ===== */
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

const validateMobileNo = (mobileNo) => {
    const mobileRegex = /^\d{11}$/;
    return mobileRegex.test(mobileNo);
};

const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return false;
    }
    const requirements = [
        /[A-Z]/, // Uppercase
        /[a-z]/, // Lowercase
        /\d/,    // Digit
        /[!@#$%^&*()\-_=+{};:,<.>]/ // Special character
    ];
    return requirements.every(rule => rule.test(password));
};


module.exports = {
    validateInputs,
    validateEmail, 
    validateMobileNo, 
    validatePassword
};