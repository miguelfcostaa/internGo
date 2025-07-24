export function getUserRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role; // "company" or "user"
    } catch (error) {
        console.error('Token inválido', error);
        return null;
    }
}