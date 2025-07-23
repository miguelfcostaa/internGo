import React from 'react';
import NavBar from '../components/NavBar';
import logo from '../assets/logo.jpg';

const ProfilePage = () => {
    return (
        <>
            <NavBar />
            <div className='container mt-5'>
                <h1 className='text-red'>Profile Page</h1>   
            </div>
            <div>{/*Barra superior*/}
                <div><img src={logo} alt="Logo" /></div>
                <span>
                    <details>
                        <summary>Nome do utlilizador</summary>
                        <p>resto das informaçoes</p>
                    </details>
                </span>
            </div>
            <div>
                <div>
                    <div>{/*Informações do utilizador*/}
                        <div>Foto de perfil</div>
                        <span>Kayne west</span>
                        <span>kaynewest@mail.com</span>
                        <button>Ver mais detalhes</button>
                    </div>
                    <div>{/*Informações do estágio ativo*/}
                        <div>
                            <h6>Estágio Ativo</h6>
                            <button>Ver Detalhes</button>
                        </div>
                        <div>
                            <p>Estágio Técnico de Sistemas</p>
                            <p>Empresa: Acin group</p>
                            <p>Data de início: Junho 2025</p>   
                        </div>
                    </div>
                </div>
                <div>
                    <table>
                        <thead>Candidaturas Efetuadas</thead>
                        <tbody>
                            <tr>
                                <td>Estágio</td>
                                <td>Empresa</td>
                                <td>Mês de Início</td>
                                <td>Duração</td>
                                <td><a href=""></a></td>
                            </tr>
                            <tr>
                                <td>Estágio de WebDeveloper</td>
                                <td>Acin</td>
                                <td>Julho</td>
                                <td>1 mês</td>
                                <td><a href=""></a></td>
                            </tr>
                            <tr>
                                <button>Mostrar todos</button>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table>
                        <thead>Estágios Recomendados</thead>
                        <tbody>
                            <tr>
                                <td>Estágio frontend Developer</td>
                                <td>Acin</td>
                                <td>Julho</td>
                                <td>1 mês</td>
                                <td><a href=""></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> 
        </>
    );
};

export default ProfilePage;