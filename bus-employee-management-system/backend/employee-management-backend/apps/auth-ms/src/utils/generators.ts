/* eslint-disable prettier/prettier */
export function generateRandomPassword(length = 12): string {
    if (length < 8 || length > 20) {
        throw new Error('Password length must be between 8 and 20 characters');
    }

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+[]{}|;:,.<>?';
    const charset = lowercase + uppercase + numbers + special;

    // Ensure at least one character from each category
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        special[Math.floor(Math.random() * special.length)],
    ].join('');

    // Fill the remaining length with random characters
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Shuffle the password to avoid predictable patterns
    password = password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return password;
}

export function generateEmployeeId(): string {
    const prefix = 'EMP'; // Prefix for employee ID
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a random number between 10000 and 99999
    return `${prefix}${randomNum}`; // Combines prefix and random number to form the employee ID
}