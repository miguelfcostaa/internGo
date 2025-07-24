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
                        {/*<ButtonMaisDetalhes onclick={() => {ToEditProfile}}/>Botão para ver mais detalhes do perfil, adicionar funçao para riderecionar para a pagina EditUserPorfile*/}
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
                            {/*<CandidaturasFeitas/> Cria a lista automaticamente*/}
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
                            {/*<EstagiosRecomendados/>Cria a lista automaticamente*/}
                        </tbody>
                    </table>
                </div>
            </div> 
        </>
    );
};

export default ProfilePage;