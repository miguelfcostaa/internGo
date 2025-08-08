import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonGeral from "../components/ButtonGeral";
import styles from "../styles/EstagiosCriados.module.css";
import ButtonVoltar from "../components/ButtonVoltar";
import useEstagiosByCompany from "../hooks/useEstagiosByCompany";

const EstagiosCriados = () => {

    const [userInfo, setUserInfo] = useState({});
    const [estagios, setEstagios] = useState([]);
    const [companyId, setCompanyId] = useState(null);
    const { estagios: estagiosByCompany, loading, reloadEstagios } = useEstagiosByCompany(companyId);

    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        console.log("EstagiosByCompany updated:", estagiosByCompany);
        setEstagios(estagiosByCompany);
    }, [estagiosByCompany]);

    const getUserInfo = async (id) => {
        const request = await fetch(`http://localhost:5000/api/companies/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await request.json();
        if (request.ok) {
            setUserInfo(data);
            setCompanyId(id); // Definir o companyId após obter as informações
        } else {
            console.error("Error fetching company info:", data.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            console.log("Company ID from token:", id);
            getUserInfo(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const alterarEstado = async (id) => {
        const estagio = estagios.find(e => e._id === id);
        if (!estagio) return;

        const request = await fetch(`http://localhost:5000/api/estagios/alterar-estado/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await request.json();
        if (request.ok) {
            setEstagios(prev =>
                prev.map(e =>
                    e._id === id
                        ? { ...e, status: e.status === 'Ativo' ? 'Inativo' : 'Ativo' }
                        : e
                )
            );
            // Recarregar os estágios para sincronizar com o servidor
            if (reloadEstagios) {
                await reloadEstagios();
            }
            setHighlightedId(id);
            setTimeout(() => setHighlightedId(null), 2000);
        } else {
            alert("Erro ao alterar estágio: " + data.message);
        }
    };


    return(
        <>
            <NavBar/>
            <div className={styles.background}>
                
                <div className={styles.flexColumn}>
                    <div className={styles.flexRow}>
                        <ButtonVoltar />
                        <h2 className={styles.titulo}>
                                Estágios Criados
                        </h2>
                        <ButtonGeral Name="Criar novo estágio" link={`/criar-estagio`} />
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                        <table className="table table-hover shadow align-middle">
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Título de Estágio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem", width: "6%" }} scope="col">Status</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Tipo de Estagio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Vagas</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Localização</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Mês de Início</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Duração</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Prazo de Candidatura</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estagios.map((estagio, index)=>(
                                    <tr key={index} >
                                        <td style={{ padding: '1rem' }}>{estagio.title}</td>
                                        <td style={estagio._id === highlightedId ? { fontWeight: "bold", transition: "font-weight 0.2s" } : {}}>
                                            {estagio.status}
                                        </td>
                                        <td>{estagio.tipoEstagio}</td>
                                        <td>{estagio.numeroVagas}</td>
                                        <td>{estagio.localizacao}</td>
                                        <td>{estagio.dataInicio}</td>
                                        <td>{estagio.duracao === 1 ? `${estagio.duracao} Mês` : `${estagio.duracao} Meses`}</td>
                                        <td>
                                            {estagio.prazoCandidatura
                                            ? new Date(estagio.prazoCandidatura)
                                                .toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                            : ''}
                                        </td>
                                        <td>
                                            <a className={styles.link} href={`/estagio/${estagio._id}`}>[Ver Candidaturas] </a>
                                            <Link className={styles.link} to={`/estagio/${estagio._id}/editar`}>[Editar] </Link>
                                            <span className={styles.link} onClick={() => alterarEstado(estagio._id)}>
                                                [{estagio.status === 'Ativo' ? 'Desativar' : 'Ativar'}]
                                            </span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EstagiosCriados;