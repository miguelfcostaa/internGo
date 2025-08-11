import { useState, useEffect, useCallback } from "react";
import { useCandidaturasContext } from "../contexts/CandidaturasContext";

export default function useCandidaturas(companyId) {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshTrigger, triggerRefresh } = useCandidaturasContext();

  const fetchCandidaturas = useCallback(async () => {
    if (companyId === null || companyId === undefined) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/candidaturas/empresa/${companyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Filtrar apenas candidaturas pendentes para mostrar na empresa
        const candidaturasPendentes = data.filter(
          (candidatura) => candidatura.status === "Pendente"
        );
        setCandidaturas(candidaturasPendentes);
      } else {
        console.error("Error fetching candidaturas:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching candidaturas:", error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCandidaturas();
  }, [fetchCandidaturas, refreshTrigger]);

  const refreshCandidaturas = useCallback(() => {
    fetchCandidaturas();
  }, [fetchCandidaturas]);

  return { candidaturas, loading, refreshCandidaturas, triggerRefresh };
}
