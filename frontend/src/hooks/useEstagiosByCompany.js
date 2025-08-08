import { useState, useEffect, useCallback } from "react";

export default function useEstagiosByCompany(companyId) {
    const [estagios, setEstagios] = useState([]);
    const [loading, setLoading] = useState(true); // Iniciar como true

    const getEstagios = useCallback(async () => {
        if (!companyId) {
            console.log("No companyId provided, skipping fetch");
            setLoading(false);
            return;
        }
        
        console.log("Fetching estagios for company:", companyId);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/estagios/company/${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();
            console.log("Response from backend:", { status: response.status, data });

            if (response.ok) {
                const estagiosComEmpresa = await Promise.all(
                    data.map(async (estagio) => {
                        let NomeEmpresa = "Empresa Desconhecida";
                        if (estagio.company) {
                            const companyRes = await fetch(`http://localhost:5000/api/companies/${estagio.company}`);
                            const companyData = await companyRes.json();
                            if (companyRes.ok && companyData.name) {
                                NomeEmpresa = companyData.name;
                            }
                        }
                        return { ...estagio, NomeEmpresa };
                    })
                );
                console.log("Processed estagios:", estagiosComEmpresa);
                setEstagios(estagiosComEmpresa);
                
                // Se há estágios, pare o loading imediatamente
                if (estagiosComEmpresa.length > 0) {
                    setLoading(false);
                } else {
                    // Se não há estágios, adicione um delay de 2 segundos antes de parar o loading
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000);
                }
            } else {
                console.error("Error fetching estagios:", response.statusText);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching estagios:", error);
            setLoading(false);
        }
    }, [companyId]);

    useEffect(() => {
        getEstagios();
    }, [getEstagios]);

    // Retornar também a função de recarregar para poder ser chamada externamente
    return { estagios, loading, reloadEstagios: getEstagios };
}