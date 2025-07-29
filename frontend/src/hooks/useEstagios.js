import { useState, useEffect } from "react";

export default function useEstagios() {
    const [estagios, setEstagios] = useState([]);

    useEffect(() => {
        const getEstagios = async () => {
            const response = await fetch(`http://localhost:5000/api/estagios/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setEstagios(data);
            } else {
                console.error("Error fetching estagios:", response.statusText);
            }
        };

        getEstagios();
    }, []);

    return estagios;
}