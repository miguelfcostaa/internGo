import { useState, useEffect } from "react";

export default function useCandidaturasFeitas(userId, role) {
    const [candidaturasFeitas, setCandidaturasFeitas] = useState([]);

    const isUser = role === 'user';

    useEffect(() => {
        if (!isUser || !userId) return;

        const getCandidaturasFeitas = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/candidaturas/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCandidaturasFeitas(data);
                } else if (response.status === 404) {
                    // Nenhuma candidatura — silenciar
                    setCandidaturasFeitas([]);
                }
            } catch (error) {
                // Silenciar completamente
            }
        };

        getCandidaturasFeitas();
    }, [userId, isUser]);

    return isUser ? candidaturasFeitas : [];
}
