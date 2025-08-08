import { useState, useEffect } from "react";

export default function useTodasCandidaturas(companyId) {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (companyId === null || companyId === undefined) {
            setLoading(false);
            return;
        }
        
        const getCandidaturas = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/candidaturas/empresa/${companyId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Retorna TODAS as candidaturas (pendentes, aceites e recusadas)
                    setCandidaturas(data);
                } else {
                    console.error("Error fetching candidaturas:", response.statusText);
                    setCandidaturas([]);
                }
            } catch (error) {
                console.error("Error fetching candidaturas:", error);
                setCandidaturas([]);
            } finally {
                setLoading(false);
            }
        };

        getCandidaturas();
    }, [companyId]);

    return { candidaturas, loading };
}
