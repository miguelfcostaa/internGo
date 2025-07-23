import React, { useState } from 'react';

const PasswordReset = () => {
  // Variável de estado 'email' com valor inicial vazio
  // 'setEmail' é a função usada para atualizar esse valor
  const [email, setEmail] = useState('');
   // Esta função é executada quando o formulário é submetido
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página recarregue ao submeter o formulário
    console.log('Email enviado para:', email);
  };
   return (
    <div>
      <h2>Envie o seu email</h2>
      <p>Por favor insire o email associado com a tua conta para poderes recuperar a palavra-passe.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"          
          id="email"           
          name="email"         
          value={email}         
          onChange={(e) => setEmail(e.target.value)} 
        />
        <br />
        <button type="submit">Enviar email</button>
      </form>
      <a href="login.jsx">Voltar para o inicio de sessão</a>
    </div>
  );
};
export default PasswordReset;