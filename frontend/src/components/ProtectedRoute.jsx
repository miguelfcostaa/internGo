import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const token = localStorage.getItem('token');
    
    // Se não há token, redireciona para login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar se o token não expirou
        const currentTime = Date.now() / 1000; // tempo atual em segundos
        if (payload.exp && payload.exp < currentTime) {
            // Token expirado, remove e redireciona para login
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
        
        // Se há um papel específico requerido, verifica
        if (requiredRole) {
            const userRole = payload.role;
            
            // Se o papel do usuário não corresponde ao requerido
            if (userRole !== requiredRole) {
                return <Navigate to="/home" replace />;
            }
        }
        
    } catch (error) {
        // Token inválido, remove e redireciona para login
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
    
    // Se passou por todas as verificações, renderiza o componente
    return children;
};

export default ProtectedRoute;
