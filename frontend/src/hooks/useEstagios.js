import { useState, useEffect } from "react";

export default function useEstagios(id) {
    const [estagio, setEstagio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEstagio = async () => {
            if (!id) return;
            
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setEstagio(data);
                } else {
                    console.error("Error fetching estagio:", response.statusText);
                    setEstagio(null);
                }
            } catch (error) {
                console.error("Error fetching estagio:", error);
                setEstagio(null);
            } finally {
                setLoading(false);
            }
        };

        getEstagio();
    }, [id]);

    return { estagio, loading };
}