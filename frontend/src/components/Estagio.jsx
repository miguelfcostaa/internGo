import React from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Estagio.module.css";

function Estagio({ NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao, idEstagio, profilePhoto }) {
    const navigate = useNavigate();
    
    // Função para verificar se o usuário é uma empresa
    const isCompany = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'company';
        } catch (error) {
            return false;
        }
    };
    
    const handleVerDetalhesClick = (e) => {
        // Prevenir que o clique no botão acione também o clique do container
        e.stopPropagation();
        // Qualquer um pode ver detalhes (empresa ou estudante)
        navigate(`/estagio/${idEstagio}`);
    };
    
    // Função para formatar o mês, que vem como //YYYY-MM e retorna o nome do mes e o ano
    const handleMesInicio = (mes) => { 
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const [ano, mesIndex] = mes.split("-");
        return `${meses[parseInt(mesIndex) - 1]} ${ano}`;
    }

    return (
        <div className={styles.estagioCard}>

        <div 
            className="container bg-white p-4 rounded" 
            style={{ 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "space-between",
                gap: "4rem",
                cursor: "pointer",
                boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
            }}
            onClick={() => navigate(`/estagio/${idEstagio}`)}
            >
            <div className={styles.logoContainer}>
                <div style={{ width: "120px", height: "120px", display: "flex", alignSelf: "center" }}>
                    <img 
                        src={`http://localhost:5000${profilePhoto}`} 
                        alt=" " 
                        width={120} 
                        height={120}
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            backgroundColor: 'rgb(185, 185, 185, 0.40)', 
                        }}
                    />
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: "500" }}>{NomeEmpresa}</div>
            </div>
            <div className={styles.estagioContainer}>
                <div style={{ 
                    fontSize: "1.4rem", 
                    fontWeight: "700", 
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    justifyContent: "space-between",
                    maxWidth: "450px",
                    }}
                >
                    {NomeEstagio}
                </div>
                <div className={styles.estagioInfo}>
                    <div className={styles.estagioInfoLeft}>
                        <div><span className={styles.estagioInfoLabel}>Vagas Totais: </span> {TotalVagas}</div>
                        <div><span className={styles.estagioInfoLabel}>Area: </span> {Area.join(", ")}</div>
                        <div><span className={styles.estagioInfoLabel}>Tipo de Estágio: </span> {TipoEstagio}</div>
                    </div>
                    <div className={styles.estagioInfoRight}>
                        <div><span className={styles.estagioInfoLabel}>Início: </span> {handleMesInicio(Inicio)}</div>
                        <div><span className={styles.estagioInfoLabel}>Duração: </span> {Duracao} mês</div>
                    </div>
                </div>
            </div>
            <div className={styles.applyContainer}>
                <p>{Localizacao}</p>
                <button 
                    className="btn btn-secondary" 
                    onClick={handleVerDetalhesClick}
                >
                    Ver Detalhes
                </button>
            </div>
            
        </div>
        </div>
    )
}
export default Estagio;