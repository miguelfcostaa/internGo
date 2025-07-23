import React, { useState } from "react";
import { signupUser } from "../services/apiService";

function RegisterUser(){
    const [formData, setFormData] = useState({
        name: '',
        cc: '',
        email: '',
        telefone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpar mensagens de erro/sucesso quando o usuário começa a digitar
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validações do frontend
        if (!formData.name || !formData.cc || !formData.email || !formData.telefone || !formData.password) {
            setError('Todos os campos são obrigatórios');
            setLoading(false);
            return;
        }

        // Validar formato do CC (8 dígitos)
        if (!/^\d{8}$/.test(formData.cc)) {
            setError('O número do cartão de cidadão deve ter exatamente 8 dígitos');
            setLoading(false);
            return;
        }

        // Validar formato do telefone (formato português)
        if (!/^(\+351)?9\d{8}$/.test(formData.telefone)) {
            setError('O número de telemóvel deve ter formato válido (9xxxxxxxx)');
            setLoading(false);
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, insira um email válido');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As palavras-passe não coincidem');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('A palavra-passe deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await signupUser(
                formData.name,
                formData.email,
                formData.cc,
                formData.telefone,
                formData.password
            );

            setSuccess('Conta criada com sucesso! Pode agora fazer login.');
            // Limpar o formulário
            setFormData({
                name: '',
                cc: '',
                email: '',
                telefone: '',
                password: '',
                confirmPassword: ''
            });

        } catch (err) {
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div>
            <div>
                <h1>Registo-Estagiário</h1>
                
                {error && (
                    <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Nome completo
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Insira o seu nome completo"
                            required
                        />
                    </label>
                    <label>Número do BI(CC)
                        <input 
                            type="text" 
                            name="cc"
                            value={formData.cc}
                            onChange={handleChange}
                            placeholder="8 dígitos (ex: 12345678)"
                            pattern="\d{8}"
                            maxLength="8"
                            required
                        />
                    </label>
                    <label>Email
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemplo@email.com"
                            required
                        />
                    </label>
                    <label>Número de telemóvel
                        <input 
                            type="tel" 
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="9xxxxxxxx (ex: 912345678)"
                            pattern="(\+351)?9\d{8}"
                            required
                        />
                    </label>
                    <label>Palavra-passe
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Insira a palavra-passe"
                            minLength="6"
                            required
                        />
                    </label>
                    <label>Confirmar palavra-passe
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirme a palavra-passe"
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'A criar conta...' : 'Criar Conta'}
                    </button>
                </form>
                <p>Já tens uma conta? <a href="/login">Faz o Login</a></p>
            </div>
        </div>
    )
}

export default RegisterUser;