import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { getUserRoleFromToken } from '../utils/jwtUtils';
import ButtonGeral from '../components/ButtonGeral';
import profilePhoto from '../assets/profile-icon.png';
import '../styles/ProfileUser.css';


const ProfilePage = () => {
    const role = getUserRoleFromToken();
    const [userInfo, setUserInfo] = useState({});

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
                console.log("Company info:", data);
            } else {
                console.error("Error fetching company info:", data.message);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            getUserInfo(id);
        }
    }, []);


    return (
        <>
            <NavBar atProfile={true} />
            <div className='background'>
                <div className='flex-row'>
                    <div className='user-info shadow'>{/*Informações do utilizador*/}
                        <div className='user-info-left'>
                            <img src={profilePhoto} alt="Foto de perfil" width={180} height={180} />
                            <ButtonGeral Name="Ver Mais Detalhes" />
                        </div>
                        <div className='user-info-right'>
                            <p>{userInfo.name}</p>
                            <p>{userInfo.email}</p>
                        </div>
                    </div>
                    <div className='estagio-ativo shadow'>{/*Informações do estágio ativo*/}
                        <div className='estagio-ativo-info'>
                            <h2>Estágio Ativo</h2>
                            <div>
                                Estágio Técnico de Sistemas<br />
                                Empresa: Acin group<br />
                                Data de início: Junho 2025<br />
                            </div>
                            
                        </div>
                        <div className='estagio-ativo-detalhes'>
                            <span>Ver Detalhes</span>    
                        </div>
                    </div>
                </div>

                <div className='mt-5'>
                    <h2 style={{ color: '#273F4F', textAlign: 'left', marginBottom: '20px' }}>
                        Candidaturas Feitas
                    </h2>
                    <table class="table table-hover shadow ">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: '#273F4F', color: 'white', textAlign: 'left', paddingLeft: "2rem" }} scope="col">Estágios</th>
                                <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Empresa</th>
                                <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Mês de Inicio</th>
                                <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Duração</th>
                                <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Tipo de Estágio</th>
                                <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'left', paddingLeft: "2rem" }}>Estagio de Tecnico</td>
                                <td>Acin</td>
                                <td>Julho</td>
                                <td>1 Mês</td>
                                <td>Hybrido</td>
                                <td className="link-icon">
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
                                <td className="link-icon">
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
                                <td className="link-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#447D9B" class="bi bi-link" viewBox="0 0 16 16">
                                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                                    </svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table>
                        <thead>Estágios Recomendados</thead>
                        <tbody>
                            {/*<EstagiosRecomendados/>Cria a lista automaticamente*/}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;