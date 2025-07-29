import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getUserRoleFromToken } from '../utils/jwtUtils';
import ButtonGeral from '../components/ButtonGeral';
import profilePhoto from '../assets/profile-icon.png';
import styles from '../styles/Profile.module.css';
import logo from '../assets/logo.jpg';
import NotFound from './NotFound404';
import useEstagiosByCompany from '../hooks/useEstagiosByCompany';

const ProfilePage = () => {

    const navigate = useNavigate();

    const role = getUserRoleFromToken();
    const [userInfo, setUserInfo] = useState({});
    const [nEstagios, setNEstagios] = useState(0);



    const getUserInfo = async (id) => {
        if (role === 'user') {
            const request = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await request.json();
            if (request.ok) {
                setUserInfo(data);
            } else {
                console.error("Error fetching user info:", data.message);
            }
        }
        else if (role === 'company') {
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
            } else {
                console.error("Error fetching company info:", data.message);
            }
        }
    };

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            getUserInfo(id);
            getNumberOfEstagios(id); 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const estagiosByCompany = useEstagiosByCompany(userInfo._id);

    return (
        <>
            <NavBar atProfile={true} />
            {role === 'user' ? (
                <div className={styles.background}>
                    <div className={styles.flexRow}>
                        <div className={styles.userInfo + ' shadow'}>{/*Informações do utilizador*/}
                            <div className={styles.userInfoLeft}>
                                <img src={profilePhoto} alt="Foto de perfil" width={180} height={180} />
                                <ButtonGeral Name="Ver Mais Detalhes" />
                            </div>
                            <div className={styles.userInfoRight}>
                                <p>{userInfo.name}</p>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>
                        <div className={styles.estagioAtivo + ' shadow'}>{/*Informações do estágio ativo*/}
                            <div className={styles.estagioAtivoInfo}>
                                <h2>Estágio Ativo</h2>
                                <div>
                                    <p>Estágio Técnico de Sistemas</p>
                                    <p>Empresa: Acin group</p>
                                    <p>Data de início: Junho 2025</p>
                                </div>
                                
                            </div>
                            <div className='estagio-ativo-detalhes'>
                                <span>Ver Detalhes</span>    
                            </div>
                        </div>
                    </div>

                    <div className='mt-5'>
                        <h2 className={styles.titulo}>
                            Candidaturas Feitas
                        </h2>
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
                                <tr>
                                    <td style={{ textAlign: 'left', paddingLeft: "2rem" }}>Estagio de Tecnico</td>
                                    <td>Acin</td>
                                    <td>Julho</td>
                                    <td>1 Mês</td>
                                    <td>Hybrido</td>
                                    <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
                                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                        </svg>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', paddingLeft: "2rem" }}>Estágio Web Development</td>
                                    <td>Sky</td>
                                    <td>Agosto</td>
                                    <td>1 Mês</td>
                                    <td>Remoto</td>
                                    <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
                                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                        </svg>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', paddingLeft: "2rem" }}>Estágio em Ciência de Dados</td>
                                    <td>ARDITI</td>
                                    <td>Julho</td>
                                    <td>3 Meses</td>
                                    <td>Presencial</td>
                                    <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
                                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                        </svg>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-5'>
                        <h2 className={styles.titulo}>
                            Estágios Recomendados
                        </h2>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
                                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                        </svg>
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src={logo} alt="Company" width={50} height={50}/></td>
                                    <td style={{ textAlign: 'left', paddingLeft: "4rem" }}>Estágio Web Development</td>
                                    <td style={{ paddingRight: "4rem" }}>Sky</td>
                                    <td style={{ paddingRight: "4rem" }}>Agosto</td>
                                    <td style={{ paddingRight: "4rem" }}>1 Mês</td>
                                    <td style={{ paddingRight: "4rem" }}>Remoto</td>
                                    <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
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
                                <img src={profilePhoto} alt="Foto de perfil" width={180} height={180} />
                                <ButtonGeral Name="Ver Mais Detalhes" link={`/profile/${userInfo.id}/`} />
                            </div>
                            <div className={styles.userInfoRight}>
                                <p style={{ fontSize: '1.5rem' }}>{userInfo.name}</p>
                                <p style={{ fontSize: '1.2rem' }}>{userInfo.email}</p>
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <h2 className={styles.titulo}>
                                    Candidaturas Recebidas
                            </h2>
                            <div className={styles.candidaturasRecebidas + ' shadow'}>
                                <div>
                                    <p>Bad Bunny</p>
                                    <p>Quim Barreiros</p>
                                    <p>Tiagovski</p>
                                </div>
                                <div>
                                    <p>Estágio de Tecnico</p>
                                    <p>Estagio de Tecnico</p>
                                    <p>Estagio Web Development</p>
                                </div>
                                <div>
                                    <p className={styles.verCandidatura}>Ver candidatura</p>
                                    <p className={styles.verCandidatura}>Ver candidatura</p>
                                    <p className={styles.verCandidatura}>Ver candidatura</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-5'>
                        <h2 className={styles.titulo}>
                            Estágios Criados
                        </h2>
                        <table className="table table-hover shadow">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', width: "5%" }} scope="col">#</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Estágios</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Vagas</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Mês de Inicio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Duração</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Tipo de Estágio</th>
                                    <th style={{ backgroundColor: '#273F4F', color: 'white', width: "7%" }} scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {estagiosByCompany.map((estagio, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{estagio.title}</td>
                                        <td>{estagio.numeroVagas}</td>
                                        <td>{estagio.dataInicio}</td>
                                        <td>{estagio.duracao}</td>
                                        <td>{estagio.tipoEstagio}</td>
                                        <td className={styles.linkIcon} style={{ paddingRight: "2rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" class="bi bi-pen" viewBox="0 0 16 16">
                                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                            </svg>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', verticalAlign: 'middle', cursor: 'pointer', fontWeight: '600' }} >
                                        <a href={`/profile/estagios/${userInfo._id}`} style={{ textDecoration: 'none', color: '#000' }}> Mostrar todos ({nEstagios}) </a>
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
    );
};

export default ProfilePage;