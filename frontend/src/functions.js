export function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}