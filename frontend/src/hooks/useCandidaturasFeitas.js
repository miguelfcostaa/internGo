import { useState, useEffect } from "react";

export default function useCandidaturasFeitas(userId) {
    const [candidaturasFeitas, setCandidaturasFeitas] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const getCandidaturasFeitas = async () => {
            const response = await fetch(`http://localhost:5000/api/candidaturas/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setCandidaturasFeitas(data);
            } else {
                console.error("Error fetching candidaturas:", response.statusText);
            }
        };

        getCandidaturasFeitas();
    }, [userId]);

    return candidaturasFeitas;
}