import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getUserRoleFromToken } from '../utils/jwtUtils';
import ButtonGeral from '../components/ButtonGeral';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import profilePhoto from '../assets/profile-icon.png';
import styles from '../styles/Profile.module.css';
import logo from '../assets/logo.jpg';
import NotFound from './NotFound404';
import useEstagiosByCompany from '../hooks/useEstagiosByCompany';
import useCandidaturasFeitas from '../hooks/useCandidaturasFeitas';
import useCandidaturas from '../hooks/useCandidaturas';
import useUser from '../hooks/useUser';

const ProfilePage = () => {



    const { id } = useParams();
    const [userInfo, setUserInfo] = useUser(id);
    const role = getUserRoleFromToken();
    const [nEstagios, setNEstagios] = useState(0);
    const candidaturasFeitas = useCandidaturasFeitas(id);
    console.log("Candidaturas Feitas:", candidaturasFeitas);
    const candidaturas = useCandidaturas(userInfo._id);
    const { estagios: estagiosByCompany, loading: estagiosLoading } = useEstagiosByCompany(userInfo?._id);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            getNumberOfEstagios(id); 
            setUserInfo(userInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    

    const getNumberOfEstagios = async (id) => {
        const request = await fetch(`http://localhost:5000/api/estagios/nEstagios/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await request.json();
        if (request.ok) {
            setNEstagios(data.nEstagios);
            return;
        } else {
            console.error("Error fetching number of estagios:", data.message);
            return 0;
        }
    };

    const handlePhotoUpdate = (newPhotoUrl) => {
        setUserInfo(prev => ({
            ...prev,
            profilePhoto: newPhotoUrl
        }));
    };

    // Função para formatar o mês, que vem como //YYYY-MM e retorna o nome do mes e o ano
    const handleMesInicio = (mes) => {
        if (!mes) return '';  
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const [ano, mesIndex] = mes.split("-");
        return `${meses[parseInt(mesIndex) - 1]} ${ano}`;
    }

    
    if (estagiosLoading) {
        return <div>Loading...</div>;
    }
    else if (!userInfo) {
        return <NotFound />;
    }
    else {
    return (
        <>
            <NavBar />
            {role === 'user' ? (
                <div className={styles.background}>
                    <div className={styles.flexRow}>
                        <div className={styles.userInfo + ' shadow'}>
                            <div className={styles.userInfoLeft}>
                                <img 
                                    src={userInfo.profilePhoto ? `http://localhost:5000${userInfo.profilePhoto}` : profilePhoto} 
                                    alt="Foto de perfil" 
                                    width={180} 
                                    height={180}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <ButtonGeral Name="Ver Detalhes" link={`/edit-profile/${userInfo._id}/`} />
                            </div>
                            <div className={styles.userInfoRight}>
                                <p>{userInfo.name}</p>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>
                        <div className={styles.estagioAtivo + ' shadow'}>
                            <div className={styles.estagioAtivoInfo}>
                                <h2>Estágio Ativo</h2>
                                <div>
                                    <p>Estágio Técnico de Sistemas</p>
                                    <p>Empresa: Acin group</p>
                                    <p>Data de início: Junho 2025</p>
                                </div>
                                
                            </div>
                            <div className={styles.estagioAtivoDetalhes}>
                                <span>Ver Detalhes</span>    
                            </div>
                        </div>
                    </div>

                    <div className='mt-5'>
                        <div className='mb-4'>
                            <h2 className={styles.titulo}>
                                Candidaturas Feitas
                            </h2>
                        </div>
                        <table className="table table-hover shadow">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', textAlign: 'left', paddingLeft: "2rem" }} scope="col">Estágios</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Empresa</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Mês de Inicio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Duração</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Tipo de Estágio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', paddingRight: "2rem" }} scope="col">#</th>
                                </tr>
                            </thead>
                           <tbody>
                                {Array.isArray(candidaturasFeitas) && candidaturasFeitas.length > 0 ? (
                                    candidaturasFeitas.map((candidatura) => (
                                        <tr key={candidatura._id}>
                                            <td style={{ textAlign: 'left', paddingLeft: "2rem" }}>
                                                {candidatura?.estagio?.title}
                                            </td>
                                            <td>{candidatura?.estagio?.company?.name}</td>
                                            <td>{handleMesInicio(candidatura?.estagio?.dataInicio)}</td>
                                            <td>{candidatura?.estagio?.duracao === 1 ? `${candidatura?.estagio?.duracao} Mês` : `${candidatura?.estagio?.duracao} Meses`}</td>
                                            <td>{candidatura?.estagio?.tipoEstagio}</td>
                                            <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                                <Link to={`/estagio/${candidatura?.estagio?._id}`} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" className="bi bi-link" viewBox="0 0 16 16">
                                                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>Nenhuma candidatura encontrada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-5'>
                        <div className='mb-4'>
                            <h2 className={styles.titulo}>
                                Estágios Recomendados
                            </h2>
                        </div>
                        <table className="table table-hover shadow align-middle" >
                            <tbody>
                                <tr>
                                    <td><img src={logo} alt="Company" width={50} height={50}/></td>
                                    <td style={{ textAlign: 'left', paddingLeft: "4rem" }}>Estagio de Tecnico</td>
                                    <td style={{ paddingRight: "4rem" }}>Acin</td>
                                    <td style={{ paddingRight: "4rem" }}>Julho</td>
                                    <td style={{ paddingRight: "4rem" }}>1 Mês</td>
                                    <td style={{ paddingRight: "4rem" }}>Hybrido</td>
                                    <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" className="bi bi-link" viewBox="0 0 16 16">
                                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                        </svg>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </div>
            ) : role === 'company' ? (
                <div className={styles.background}>
                    <div className={styles.flexRow}>
                        <div className={styles.userInfo + ' shadow'}>
                            <div className={styles.userInfoLeft}>
                                <img 
                                    src={userInfo.profilePhoto ? `http://localhost:5000${userInfo.profilePhoto}` : profilePhoto} 
                                    alt="Foto de perfil" 
                                    width={180} 
                                    height={180}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <ButtonGeral Name="Ver Detalhes" link={`/edit-profile/${userInfo._id}/`} />
                            </div>

                            <div className={styles.userInfoRight}>
                                <p style={{ fontSize: '1.5rem' }}>{userInfo.name}</p>
                                <p style={{ fontSize: '1.2rem' }}>{userInfo.email}</p>
                            </div>
                        </div>
                        <div className={styles.candidaturasContainer}>
                            <h2 className={styles.titulo}>
                                    Candidaturas Recebidas
                            </h2>
                            <div className={styles.candidaturasRecebidas + ' shadow'}>
                                {candidaturas.map((candidatura, index) => (
                                    <div key={index} className={styles.candidaturaItem}>
                                            <p><Link className={styles.verCandidatura} to={`/estagiario/${candidatura.user._id}`}>{candidatura.user.name}</Link></p>
                                            <p>{candidatura.estagio.title}</p>
                                            <p className={styles.verCandidatura}>Ver candidatura</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='mt-5'>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 className={styles.titulo} style={{ cursor: "pointer" }} onClick={() => window.location.href = `/estagios-criados/${userInfo._id}`}>
                                    Estágios Criados
                            </h2>
                            <ButtonGeral Name="Criar Estágio" link={`/criar-estagio`} />
                        </div>

                        <table className="table table-hover shadow">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', width: "5%" }} scope="col">#</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Estágios</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Estado</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Mês de Inicio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Duração</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Tipo de Estágio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', width: "7%" }} scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {estagiosLoading ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                            Carregando estágios...
                                        </td>
                                    </tr>
                                ) : estagiosByCompany && estagiosByCompany.length > 0 ? (
                                    estagiosByCompany.map((estagio, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{estagio.title}</td>
                                            <td>{estagio.status}</td>
                                            <td>{estagio.dataInicio}</td>
                                            <td>{estagio.duracao === 1 ? `${estagio.duracao} Mês` : `${estagio.duracao} Meses`}</td>
                                            <td>{estagio.tipoEstagio}</td>
                                            <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                                <Link to={`/estagio/${estagio._id}/editar`} style={{ textDecoration: 'none' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" className="bi bi-pen" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                            Nenhum estágio criado.
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', verticalAlign: 'middle', cursor: 'pointer', fontWeight: '600' }} onClick={() => window.location.href = `/estagios-criados/${userInfo._id}`}>
                                        <a href={`/estagios-criados/${userInfo._id}`} style={{ textDecoration: 'none', color: '#000' }}> Mostrar todos ({nEstagios}) </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <NotFound />
            )}
            
        </>
    )};
};

export default ProfilePage;