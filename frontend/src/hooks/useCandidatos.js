import { useState, useEffect } from "react";

export default function useCandidatos(userId) {
    const [candidatos, setCandidatos] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const getCandidatos = async () => {
            const response = await fetch(`http://localhost:5000/api/candidaturas/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setCandidatos(data);
            } else {
                console.error("Error fetching candidatos:", response.statusText);
            }
        };

        getCandidatos();
    }, [userId]);

    return candidatos;
}