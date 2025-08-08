import { useState } from "react";
import { getUserRoleFromToken } from "../utils/jwtUtils.js";
import { useEffect } from "react";
    
const useUser = (id) => {

    const role = getUserRoleFromToken();
    const [userInfo, setUserInfo] = useState({});

    const getUserInfo = async (id) => {
        if (role === 'user') {
            const request = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await request.json();
            if (request.ok) {
                setUserInfo(data);
            } else {
                console.error("Error fetching user info:", data.message);
            }
        } else if (role === 'company') {
            const request = await fetch(`http://localhost:5000/api/companies/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await request.json();
            if (request.ok) {
                // For companies, extract the company data from the response
                const companyData = data.company || data;
                console.log('🔍 useUser: Company data received:', companyData); // Debug log
                setUserInfo(companyData);
            } else {
                console.error("Error fetching company info:", data.message);
            }
        }
    };

    useEffect(() => {
        if (id) {
            console.log('🔍 useUser: Fetching user info for ID:', id); // Debug log
            getUserInfo(id);
        } else {
            // Fallback to token ID if no ID provided
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const tokenId = payload.id;
                console.log('🔍 useUser: Using token ID:', tokenId); // Debug log
                getUserInfo(tokenId);
            }
        }
    }, [id]);

    return [userInfo, setUserInfo];
};

export default useUser;