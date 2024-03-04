/* ===== Register Validation Start ===== */
function registerValidation(data) {
    const errors = [];

    const requiredFields = ['firstname', 'lastname', 'username', 'email', 'password', 'confirmPassword', 'mobileNo', 'address', 'birthdate'];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    }

    if (data.password !== data.confirmPassword) {
        errors.push("Passwords do not match");
    }

    if (data.password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
        errors.push("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push("Valid email address is required");
    }

    const mobileRegex = /^[0-9]{11}$/;
    if (!mobileRegex.test(data.mobileNo)) {
        errors.push("Valid mobile number is required");
    }

    if (!data.birthdate || !isValidDate(data.birthdate)) {
        errors.push("Valid birthdate in YYYY-MM-DD format is required");
    } else {
        const birthDate = new Date(data.birthdate);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        if (birthDate > eighteenYearsAgo) {
            errors.push("User must be at least 18 years old");
        }
    }

    return errors;
}
/* ===== Register Validation End ===== */

/* ===== Login Validation Start ===== */
function loginValidation(data) {
    const errors = [];

    if (!data.emailOrUsername) {
        errors.push("Email or username is required");
    } else if (!data.password) {
        errors.push("Password is required");
    }

    return errors;
}
/* ===== Login Validation End ===== */

/* ===== Update Profile Validation Start ===== */
function updateProfileValidation(data) {
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push("Valid email address is required");
    }

    const mobileRegex = /^[0-9]{11}$/;
    if (data.mobileNo && !mobileRegex.test(data.mobileNo)) {
        errors.push("Valid mobile number is required");
    }

    if (data.birthdate) {
        const birthDate = new Date(data.birthdate);
        if (!isValidDate(data.birthdate)) {
            errors.push("Valid birthdate in YYYY-MM-DD format is required");
        } else {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            if (birthDate > eighteenYearsAgo) {
                errors.push("User must be at least 18 years old");
            }
        }
    }

    return errors;
}
/* ===== Update Profile Validation End ===== */

/* ===== Change Password Validation Start ===== */
function changePasswordValidation(data) {
    const errors = [];

    const requiredFields = ['currentPassword', 'newPassword', 'confirmPassword'];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    }

    if (data.newPassword !== data.confirmPassword) {
        errors.push("New password and confirm password do not match");
    }

    if (data.newPassword.length < 8) {
        errors.push("New password must be at least 8 characters long");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.newPassword)) {
        errors.push("New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }

    return errors;
}
/* ===== Change Password Validation End ===== */

/* ===== Date Validation Start ===== */
function isValidDate(dateString) {
    // Regular expression to match YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    // Parse the date parts to integers
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Check if the year, month, and day are valid
    if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) monthLength[1] = 29;
    return day > 0 && day <= monthLength[month - 1];
}
/* ===== Date Validation End ===== */

module.exports = { 
    registerValidation, 
    loginValidation, 
    updateProfileValidation,
    changePasswordValidation
};