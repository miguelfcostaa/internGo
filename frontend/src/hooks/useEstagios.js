import { useState, useEffect } from "react";

export default function useEstagios(companyId) {
    const [estagios, setEstagios] = useState([]);

    useEffect(() => {
        const getEstagios = async () => {
            const response = await fetch(`http://localhost:5000/api/estagios/${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

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
                setEstagios(estagiosComEmpresa);
                console.log("Estágios fetched successfully:", estagiosComEmpresa);
            } else {
                console.error("Error fetching estagios:", response.statusText);
            }
        };

        getEstagios();
    }, []);

    return estagios;
}