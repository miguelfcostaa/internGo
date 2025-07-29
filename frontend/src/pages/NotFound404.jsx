import React from 'react';
import ButtonGeral from '../components/ButtonGeral';

const NotFound = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  height: '100vh' }}>
        <div className="container bg-white rounded shadow p-5 text-center" style={{ width: '400px' }}>
            <h1>404</h1>
            <p>Page not found.</p> 
            <ButtonGeral Name="Voltar" onClick={() => window.location.href = '/home'} />
        </div>
        
    </div>
);

export default NotFound;