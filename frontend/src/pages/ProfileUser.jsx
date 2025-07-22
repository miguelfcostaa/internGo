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
            <div>
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
                    <div></div>
                </div>
                <div>

                </div>
            </div>
        </>
    );
};

export default ProfilePage;