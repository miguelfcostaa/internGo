import { useState, useEffect } from "react";

export default function useCandidaturasEstagio(estagioId) {
    const [candidaturasEstagio, setCandidaturasEstagio] = useState([]);

    useEffect(() => {
        if (estagioId === null || estagioId === undefined) return;
        const getCandidaturas = async () => {
            const response = await fetch(`http://localhost:5000/api/candidaturas/estagio/${estagioId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setCandidaturasEstagio(data);
            } else {
                console.error("Error fetching candidaturas:", response.statusText);
            }
        };

        getCandidaturas();
    }, [estagioId]);

    return candidaturasEstagio;
}