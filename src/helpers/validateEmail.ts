export function validateEmail(email: string) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    
    return re.test(email);
}