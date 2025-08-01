import { useState, useEffect } from "react";

export default function useCandidaturas(companyId) {
    const [candidaturas, setCandidaturas] = useState([]);

    useEffect(() => {
        const getCandidaturas = async () => {
            const response = await fetch(`http://localhost:5000/api/candidaturas/empresa/${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setCandidaturas(data);
            } else {
                console.error("Error fetching candidaturas:", response.statusText);
            }
        };

        getCandidaturas();
    }, [companyId]);

    return candidaturas;
}