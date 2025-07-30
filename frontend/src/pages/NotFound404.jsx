import React from 'react';
import ButtonVoltar from '../components/ButtonVoltar';
import styles from "../styles/NotFound.module.css";

const NotFound = () => (
    <div className={styles.container}>
        <div className="container bg-white rounded shadow p-4 text-center" style={{ width: '800px' }}>
            <ButtonVoltar onClick={() => window.location.href = '/home'} />
            <h1 className='mt-5'>404 Page not found</h1>
            <p ></p>
            <p>Sorry, the page you are looking for does not exist.</p>
            <p>You can go back to the <a href="/home">Home Page</a>.</p>
        </div>
        
    </div>
);

export default NotFound;