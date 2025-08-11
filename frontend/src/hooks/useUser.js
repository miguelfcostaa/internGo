import { useState, useEffect } from "react";
import { getUserRoleFromToken } from "../utils/jwtUtils.js";

const useUser = (id) => {
    const role = getUserRoleFromToken();
    const [userInfo, setUserInfo] = useState({});

    const refreshUser = async (userId) => {
        const targetId = userId || id;
        if (!targetId) return;

        try {
            let url = "";
            if (role === "user") {
                url = `http://localhost:5000/api/users/${targetId}`;
            } else if (role === "company") {
                url = `http://localhost:5000/api/companies/${targetId}`;
            }

            const request = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await request.json();
            if (request.ok) {
                if (role === "company") {
                    const companyData = data.company || data;
                    setUserInfo(companyData);
                } else {
                    setUserInfo(data);
                }
            } else {
                console.error("Error fetching user info:", data.message);
            }
        } catch (err) {
            console.error("❌ Erro ao buscar dados do utilizador:", err);
        }
    };

    useEffect(() => {
        if (id) {
            refreshUser(id);
        } else {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                refreshUser(payload.id);
            }
        }
    }, [id]);

    return [userInfo, setUserInfo, refreshUser];
};

export default useUser;
