import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonVoltar from "../components/ButtonVoltar";
import NavBar from "../components/NavBar";
import style from "../styles/PaginaCandidatarEstagio.module.css";
import useUser from "../hooks/useUser.js";
import useEstagios from "../hooks/useEstagios.js";
import { useNavigate } from "react-router-dom";

function PaginaCandidatarEstagio() {
    const navigate = useNavigate();

    const { id } = useParams();
    const { estagio } = useEstagios(id);
    const [user] = useUser();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    
    // Função para verificar se é empresa
    const isCompany = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'company';
        } catch (error) {
            return false;
        }
    };

    // Redirecionar empresas para a página inicial
    useEffect(() => {
        if (isCompany()) {
            alert('Empresas não podem candidatar-se aos estágios. Apenas estudantes podem candidatar-se.');
            navigate('/home');
            return;
        }
    }, [navigate]);

    const [Warnings, setWarnings] = useState({
        name: false,
        morada: false,
        universidade: false,
        curso: false,
        carta: false,
    });
    const [formData, setFormData] = useState({
        name: '',
        telefone: '',
        email: '',
        morada: '',
        codigoPostal: '',
        dataNascimento: '',
        nif: '',
        competenciasTecnicas: [],
        formacaoAcademica: '',
        cc: '',
        universidade: '',
        curso: '',
        cv: '',
        cartaDeApresentacao: ''
    });

    const [inputValue, setInputValue] = useState(''); //utilizado no input

    const messageMaxChat = "Atingiu o maximo de caracteres permitido";

    const handleChange = (maxChars = 10000) => (e) => {
        const { name, value } = e.target;
        if (value.length <= maxChars) {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setWarnings((prev) => ({ ...prev, [name]: value.length === maxChars }));
        }
    };
    function onChange(newSkills) {
        setFormData((prev) => ({ ...prev, competenciasTecnicas: newSkills }));
    }

    //cria o input competencias tecnicas que adiciona uma a uma e permite deletar skills
    const handleKeyDown = (e) => {
        const value = e.target.value;
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(value)
            setInputValue('');
        }
    }

    const addSkill = (value) => {
        const trimmed = value.trim();
        if (trimmed && !formData.competenciasTecnicas.includes(trimmed)) {
            const newSkills = [...formData.competenciasTecnicas, trimmed];
            setFormData((prev) => ({ ...prev, competenciasTecnicas: newSkills }));
        }
    };

    const removeSkill = (index) => {
        const newSkills = formData.competenciasTecnicas.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, competenciasTecnicas: newSkills }));
    };

    const handlesSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setFieldErrors({});
        try {
            const request = await fetch(`http://localhost:5000/api/candidaturas/candidatar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    estagio: id,
                    user: user._id
                })
            });

            const response = await request.json();
            if (request.ok) {
                const responseUser = await fetch(`http://localhost:5000/api/users/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        ...formData,
                    }),
                });

                const updatedUser = await responseUser.json();

                if (responseUser.ok) {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate(`/profile/${user._id}`);
                    }, 2000);
                    setFormData({});
                    setFieldErrors({});
                } else {
                    if (updatedUser.message && typeof updatedUser.message === 'object') {
                        setFieldErrors(updatedUser.message);
                    } else if (typeof updatedUser.message === 'string') {
                        setFieldErrors({ general: updatedUser.message });
                    }
                }
            }
            else {
                if (response.message && typeof response.message === 'object') {
                    setFieldErrors(response.message);
                } else if (typeof response.message === 'string') {
                    setFieldErrors({ general: response.message });
                }
            }
        } catch (err) {
            setFieldErrors({ general: "Erro inesperado ao submeter candidatura." });
        } finally {
            setIsLoading(false);
        }
    }
    function handleMesInicio(dataInicio) {
        if (!dataInicio) return null;
        const mes = new Date(dataInicio).toLocaleString('pt-PT', { month: 'long' });
        return mes.charAt(0).toUpperCase() + mes.slice(1);
    }


    useEffect(() => {
        if (user && user._id) {
            setFormData({
                name: user.name || '',
                telefone: user.telefone || '',
                email: user.email || '',
                morada: user.morada || '',
                codigoPostal: user.codigoPostal || '',
                dataNascimento: user.dataNascimento || '',
                nif: user.nif || '',
                competenciasTecnicas: user.competenciasTecnicas || [],
                formacaoAcademica: user.formacaoAcademica || '',
                cc: user.cc || '',
                universidade: user.universidade || '',
                curso: user.curso || '',
                cv: user.cv || '',
                cartaDeApresentacao: ''
            });
        }
    }, [user]);


    const handleHabilitacoes = (habilitacoes) => {
        const habilitacoesMap = {
            "1": "Nível 1 - 4º ano do Ensino Básico",
            "2": "Nível 2 - 6º ano do Ensino Básico",
            "3": "Nível 3 - 9º ano do Ensino Básico",
            "4": "Nível 4 - Ensino Secundário + Estágio Profissional",
            "5": "Nível 5 - Cursos de Especialização Tecnológica (CET)",
            "6": "Nível 6 - Licenciatura",
            "7": "Nível 7 - Mestrado",
            "8": "Nível 8 - Doutoramento"
        };
        return habilitacoesMap[habilitacoes] || habilitacoes;
    };

    return (
        <>
            <NavBar />
            <div className={style.background}>
                <ButtonVoltar />
                <div className={style.formcontainer}>
                    <div className={style.sidebar}>
                        {estagio ? (
                            <>
                                <h3 style={{ textAlign: 'left' }}>Detalhes do Estágio - {estagio.title}</h3>
                                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'justify', fontSize: '1rem' }}>
                                    <p><strong>Descrição:</strong> {estagio.descricao || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                    <p><strong>Benefícios:</strong> {estagio.beneficios ? estagio.beneficios.join(', ') : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                    <p><strong>Competências Técnicas:</strong> {estagio.competenciasTecnicas ? estagio.competenciasTecnicas.join(', ') : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                    <p><strong>Competências Pessoais:</strong> {estagio.competenciasPessoais ? estagio.competenciasPessoais.join(', ') : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                    <p><strong>Cursos Preferenciais:</strong> {estagio.cursosPreferenciais ? estagio.cursosPreferenciais.join(', ') : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                    <p><strong>Observações:</strong> {estagio.observacoes || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
                                </div>
                            </>
                        ) : (
                            <p style={{ textAlign:'left', color: '#888', marginTop: '2rem' }}>Informações não disponíveis.</p>
                        )}
                    </div>
                    <div style={{ marginTop: "1rem", textAlign: "left", marginBottom: "10px", fontSize: '1.1rem' }}>
                        Prencha os campos abaixo para se candidatar ao Estágio.
                    </div>
                    <div className={style.bigbox}>
                        <form onSubmit={handlesSubmit}>
                            <div style={{ paddingRight: "10%", paddingLeft: "10%", marginTop: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>Nome completo:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui o seu nome completo"
                                                name="name"
                                                value={formData.name}
                                                className={style.input}
                                                onChange={handleChange(100)}
                                            />
                                            {/*Mensagem qquando o limite de caracteres é atingindo*/}
                                            {Warnings["name"] && (
                                                <span className={style.charterror}>
                                                    {messageMaxChat}
                                                </span>
                                            )}
                                        </label>
                                        <label className={style.labelcoluna}>Email:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui o seu email"
                                                name="email"
                                                value={formData.email}
                                                className={style.input}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>Nº de telemóvel:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui o seu número de telemóvel" name="telefone"
                                                value={formData.telefone}
                                                className={style.input}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                        <label className={style.labelcoluna}>Data de nascimento:
                                            <input
                                                type="text"
                                                placeholder="AAAA-MM-DD"
                                                name="dataNascimento"
                                                value={formData.dataNascimento?.slice(0, 10)}
                                                className={style.inputdate}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>Morada:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui a sua morada"
                                                name="morada"
                                                value={formData.morada}
                                                className={style.input}
                                                onChange={handleChange(100)}
                                            />
                                            {Warnings["morada"] && (
                                                <span className={style.charterror}>
                                                    {messageMaxChat}
                                                </span>
                                            )}
                                        </label>
                                        <label className={style.labelcoluna}>Código postal:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui o seu código postal"
                                                name="codigoPostal"
                                                value={formData.codigoPostal}
                                                className={style.input}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>NIF:
                                            <input
                                                type="text"
                                                placeholder=""
                                                name="nif"
                                                value={formData.nif}
                                                className={style.input}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                        <label className={style.labelcoluna}>Nº do CC:
                                            <input
                                                type="text"
                                                placeholder="Escreva aqui o seu número do Cartão de Cidadão"
                                                name="cc"
                                                value={formData.cc}
                                                className={style.input}
                                                onChange={handleChange()}
                                            />
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>Universidade/Entidade Formadora:
                                            <input
                                                type="text"
                                                placeholder="Ex: Universidade de Lisboa"
                                                name="universidade"
                                                value={formData.universidade}
                                                className={style.input}
                                                onChange={handleChange(100)}
                                            />
                                            {Warnings["universidade"] && (
                                                <span className={style.charterror}>
                                                    {messageMaxChat}
                                                </span>
                                            )}
                                        </label>
                                        <label className={style.labelcoluna}>Curso:
                                            <input
                                                type="text"
                                                placeholder="Ex: Engenharia Informática"
                                                name="curso"
                                                value={formData.curso}
                                                className={style.input}
                                                onChange={handleChange(100)}
                                            />
                                            {Warnings["curso"] && (
                                                <span className={style.charterror}>
                                                    {messageMaxChat}
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '10px' }}>
                                            <label className={style.labelcoluna}>Competências Técnicas:</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Trabalho em Equipa, Design Gráfico..."
                                                name="competenciasTecnicas"
                                                value={inputValue}
                                                className={style.input}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />

                                            {formData.competenciasTecnicas && formData.competenciasTecnicas.length > 0 ? (
                                                <div style={{
                                                    overflowY: 'auto',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    backgroundColor: '#f9f9f9',
                                                    paddingTop: '8px',
                                                    gap: '8px',
                                                }}>
                                                    {formData.competenciasTecnicas.map((skill, i) => (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: 'center',
                                                                background: '#e6e6e6ff',
                                                                borderRadius: '8px',
                                                                gap: '8px',
                                                                paddingTop: '8px',
                                                                paddingBottom: '8px',
                                                                paddingLeft: '12px',
                                                                paddingRight: '12px',
                                                            }}
                                                        >
                                                            {skill}
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="22"
                                                                height="22"
                                                                fill="red"
                                                                className="bi bi-x"
                                                                viewBox="0 0 16 16"
                                                                onClick={() => removeSkill(i)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                            </svg>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                        <label className={style.labelcoluna}>Formação Académica:
                                            <select
                                                name="formacaoAcademica"
                                                className={style.select}
                                                onChange={handleChange()}
                                                value={formData.formacaoAcademica}
                                            >
                                                <option value="">Escolha o seu nível de habilitação</option>
                                                <option value="1">Nível 1 - 4º Ano do Ensino Básico</option>
                                                <option value="2">Nível 2 - 6º Ano do Ensino Básico</option>
                                                <option value="3">Nível 3 - 9º Ano do Ensino Básico</option>
                                                <option value="4">Nível 4 - Ensino Secundário + Estágio Profissional</option>
                                                <option value="5">Nível 5 - Cursos de Especialização Tecnólogica (CET)</option>
                                                <option value="6">Nível 6 - Licenciatura</option>
                                                <option value="7">Nível 7 - Mestrado</option>
                                                <option value="8">Nível 8 - Doutoramento</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className={style.formrow}>
                                        <label className={style.labelcoluna}>Adicione o seu CV:
                                            <input
                                                type="file"
                                                name="cv"
                                                className={style.inputfile}
                                                style={{ marginTop: '0px', marginBottom: '0px' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <label className={style.labelcoluna}>Escreva a sua carta de Apresentação:
                                    <textarea
                                        className={style.textarea}
                                        rows="6"
                                        cols="50"
                                        name="cartaDeApresentacao"
                                        value={formData.cartaDeApresentacao}
                                        onChange={handleChange()}
                                        placeholder="Escreva aqui a sua carta de apresentação..."
                                    />
                                </label>
                                {Warnings["cartaDeApresentacao"] && (
                                    <span className={style.charterror}>
                                        {messageMaxChat}
                                    </span>
                                )}

                                <div>
                                    {Object.keys(fieldErrors).length > 0 && (
                                        <div className={`alert ${style.alertDanger}`}>
                                            <ul className="mb-0">
                                                {Object.values(fieldErrors).map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {success && (
                                        <div className={`alert ${style.alertSuccess}`}>
                                            <ul className="mb-0">
                                                <li>Candidatura enviada com sucesso!</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input type="submit" value={isLoading ? "A enviar..." : "Candidatar"} className={style.submit} disabled={isLoading} />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PaginaCandidatarEstagio;