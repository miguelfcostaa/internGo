import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";
import NavBar from "../components/NavBar";
import style from "../styles/EditarEstagio.module.css";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";
import TagInput from "../components/TagInput.jsx";

const STEPS = {
    BASICO: 1,
    DETALHES: 2,
    REQUISITOS: 3,
    CONFIRMAR: 4,
};

    const EditarEstagio = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);    
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        area: [],
        numeroVagas: 0,
        localizacao: "",
        dataInicio: "",
        tipoEstagio: "",
        duracao: 0,
        prazoCandidatura: "",
        descricao: "",
        beneficios: [],
        horaInicio: "",
        horaFim: "",
        habilitacoesMinimas: "",
        cursosPreferenciais: [],
        competenciasTecnicas: [],
        competenciasPessoais: [],
        idiomas: [],
        observacoes: "",
    });

    //limite de cratcteres
    const [Warnings, setWarnings] = useState({
        title: false,
        area: false,
        vagas: false,
        localizacao: false,
        inicio: false,
        tipoEstagio: false,
        duracao: false,
        prazoCandidatura: false,
        descricao: false,
        beneficios: false,
        horaInicio: false,
        horaFim: false,
        habilitacoes: false,
        competenciasTecnicas: false,
        competenciasPessoais: false,
        idiomas: false,
        observacoes: false,
    });

    useEffect(() => {
        const carregarEstagio = async () => {
        try {
            setLoadingData(true);
            const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao carregar dados do estágio");
            }

            const estagio = await response.json();
            setFormData({
                title: estagio.title,
                area: estagio.area,
                numeroVagas: estagio.numeroVagas,
                localizacao: estagio.localizacao,
                dataInicio: estagio.dataInicio,
                tipoEstagio: estagio.tipoEstagio,
                duracao: estagio.duracao,
                prazoCandidatura: estagio.prazoCandidatura ? estagio.prazoCandidatura.slice(0, 10) : "",
                descricao: estagio.descricao,
                beneficios: estagio.beneficios,
                horaInicio: estagio.horaInicio,
                horaFim: estagio.horaFim,
                habilitacoesMinimas: estagio.habilitacoesMinimas,
                cursosPreferenciais: estagio.cursosPreferenciais,
                competenciasTecnicas: estagio.competenciasTecnicas,
                competenciasPessoais: estagio.competenciasPessoais,
                idiomas: estagio.idiomas,
                observacoes: estagio.observacoes,
            });


        } catch (error) {
            console.error("Erro ao carregar estágio:", error);
            setError("Erro ao carregar dados do estágio. Tente novamente.");
        } finally {
            setLoadingData(false);
        }
        };

        if (id) {
            carregarEstagio();
        }
    }, [id]);

    // Limites específicos para cada campo
    const fieldLimits = {
        title: 60,
        localizacao: 40,
        area: 30,
        descricao: 500,
        beneficios: 300,
        competenciasTecnicas: 300,
        cursosPreferenciais: 200,
        competenciasPessoais: 200,
        idiomas: 150,
        observacoes: 150,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const limit = fieldLimits[name];
        
        // Se o campo tem limite específico, aplica a validação
        if (limit && value.length > limit) {
            return; // Não permite ultrapassar o limite
        }
        
        // Atualiza o valor
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Atualiza os warnings se necessário
        if (limit) {
            setWarnings((prev) => ({ ...prev, [name]: value.length === limit }));
        }
    };

    const handleNext = async () => {
        if (step < STEPS.CONFIRMAR) {
            setStep(step + 1);
        } else if (step === STEPS.CONFIRMAR) {
            await handleAtualizarEstagio();
        }
    };

    const handleAtualizarEstagio = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        setFieldErrors({});

        try {
            const request = await fetch(`http://localhost:5000/api/estagios/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            const response = await request.json();
			if (request.ok) {
				setSuccess(true);
				setTimeout(() => {
					navigate(`/profile/${id}`);
				}, 2000);
				setFormData({});
				setFieldErrors({});
			} else {
				if (response.message && typeof response.message === 'object') {
                    setFieldErrors(response.message);
                } else if (typeof response.message === 'string') {
                    setFieldErrors({ general: response.message });
                }
			}	
		} catch (error) {
            console.error("Erro ao publicar estágio:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step > STEPS.BASICO) setStep(step - 1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleDeleteEstagio = async () => {
        setLoadingDelete(true);
        setError("");

        try {
        const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao deletar estágio");
        }

        setSuccess("Estágio deletado com sucesso!");
        setShowDeleteModal(false);

        setTimeout(() => {
            const userToken = localStorage.getItem("token");
            if (userToken) {
            const payload = JSON.parse(atob(userToken.split(".")[1]));
            const userId = payload.id;
            navigate(`/estagios-criados/${userId}`);
            } else {
            navigate("/profile");
            }
        }, 1500);
        } catch (error) {
        console.error("Erro ao deletar estágio:", error);
        setError(error.message || "Erro ao deletar estágio. Tente novamente.");
        setShowDeleteModal(false);
        } finally {
        setLoadingDelete(false);
        }
    };

    if (loadingData) {
        return (
        <Container className="mt-5">
            <p>Carregando dados do estágio...</p>
        </Container>
        );
    }
    return (
    <>
        <NavBar />
        {Object.keys(fieldErrors).length > 0 && (
            <div className={`alert ${style.alertDanger}`}>
                <ul className="mb-0">
                    {Object.values(fieldErrors).map((error, index) => (
                        <span key={index}>{error} <br /></span>
                    ))}
                </ul>
            </div>
        )}
        {success && (
            <div className={`alert ${style.alertSuccess}`}>
                <ul className="mb-0">
                    <span>Estágio atualizado com sucesso!</span>
                </ul>
            </div>
        )}


      <Container className="mt-5">
        <div className={`${style.container} ${style.mt4}`}>
          <div className={`${style.mb4} ${style.borderBottom} ${style.pb2}`} style={{ display: "flex", justifyContent: "center" }}>
            <div className={style.progressBar}>
              <span className={step === 1 ? style.fwBold : style.textMuted}>
                1. Informações Básicas
              </span>{" "}
              &gt;
              <span className={`${step === 2 ? style.fwBold : style.textMuted} ${style.mx2}`}>
                2. Detalhes do Estágio
              </span>{" "}
              &gt;
              <span className={`${step === 3 ? style.fwBold : style.textMuted} ${style.mx2}`}>
                3. Requisitos
              </span>{" "}
              &gt;
              <span className={`${step === 4 ? style.fwBold : style.textMuted} ${style.mx2}`}>
                4. Revisão
              </span>
            </div>
          </div>

          {/* Paso 1*/}
          {step === 1 && (
            <div>
              {/* Título do Estágio */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Título do Estágio <RequiredFieldTooltip />
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Estágio em Desenvolvimento Web"
                  className={`${style.input} ${formData.title.length > 60 ? "is-invalid" : ""}`}
                />
                <div className="d-flex justify-content-between">
                  {formData.title.length > 60 && (
                    <span className={style.charterror}>Máximo de 60 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.title.length > 60 ? "text-danger" : "text-muted"}`}>
                    {formData.title.length}/60 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Área de Atuação */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Área de Atuação <RequiredFieldTooltip />
                </Form.Label>
                <TagInput
                  value={formData.area}
                  onChange={(tags) =>
                    setFormData((prev) => ({ ...prev, area: tags }))
                  }
                  placeholder="Escreva áreas de atuação (Ex: Desenvolvimento, Marketing, Design)"
                />
                <div className="d-flex justify-content-between">
                  {formData.area.length > 30 && (
                    <span className={style.charterror}>Máximo de 30 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.area.length > 30 ? "text-danger" : "text-muted"}`}>
                    {formData.area.length}/30 caracteres
                  </small>
                </div>
              </Form.Group>

              <Row>
                {/* Número de Vagas */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Número de Vagas <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="numeroVagas"
                      value={formData.numeroVagas}
                      onChange={handleChange}
                      min="1"
                      placeholder="1"
                      className={style.input}
                    />
                  </Form.Group>
                </Col>

                {/* Localização */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Localização <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="localizacao"
                      value={formData.localizacao}
                      onChange={handleChange}
                      placeholder="Ex: Lisboa, Porto, Remoto"
                      className={`${style.input} ${formData.localizacao.length > 40 ? "is-invalid" : ""}`}
                    />
                    <div className="d-flex justify-content-between">
                      {formData.localizacao.length > 40 && (
                        <span className={style.charterror}>Máximo de 40 caracteres ultrapassado!</span>
                      )}
                      <small className={`ms-auto ${formData.localizacao.length > 40 ? "text-danger" : "text-muted"}`}>
                        {formData.localizacao.length}/40 caracteres
                      </small>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Mês de Início e Tipo de Estágio */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Mês de Início <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      type="month"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      className={style.input}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                   <Form.Label className={`${style.label} fw-bold`}>
                      Tipo de Estágio <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Select
                      name="tipoEstagio"
                      value={formData.tipoEstagio}
                      onChange={handleChange}
                      className={style.select}
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
          {/* Paso 2 */}
          {step === 2 && (
            <div>
              <Row>
                {/* Duração do Estágio */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Duração do Estágio <RequiredFieldTooltip />
                    </Form.Label>
                    <div style={{ display: "flex", alignItems: "center", gap: '1rem' }}>
                        <Form.Control
                            className={style.input}
                            type="number"
                            name="duracao"
                            value={formData.duracao}
                            onChange={handleChange}
                            placeholder="Ex: 1"
                            defaultValue={1}
                            min="1"
                            max="12"
                            style={{ width: "80px" }}
                        />
                        Mes(es)
                    </div>
                  </Form.Group>
                </Col>

                {/* Prazo Limite */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Prazo Limite de Candidatura <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="prazoCandidatura"
                      value={formData.prazoCandidatura}
                      onChange={handleChange}
                      className={style.input}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Descrição do Estágio */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Descrição do Estágio <RequiredFieldTooltip />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva as principais atividades e responsabilidades..."
                  className={`${style.textarea} ${formData.descricao.length > 500 ? "is-invalid" : ""}`}
                />
                <div className="d-flex justify-content-between">
                  {formData.descricao.length > 500 && (
                    <span className={style.charterror}>Máximo de 500 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.descricao.length > 500 ? "text-danger" : "text-muted"}`}>
                    {formData.descricao.length}/500 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Benefícios Oferecidos */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Benefícios Oferecidos <RequiredFieldTooltip />
                </Form.Label>
                <TagInput
                  value={formData.beneficios}
                  onChange={(tags) =>
                  setFormData((prev) => ({ ...prev, beneficios: tags }))
                  }
                  placeholder="Escreva os benefícios oferecidos (Ex: Vale transporte, Vale refeição, Seguro de saúde)"
                />
                <div className="d-flex justify-content-between">
                  {formData.beneficios.length > 300 && (
                    <span className={style.charterror}>Máximo de 300 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.beneficios.length > 300 ? "text-danger" : "text-muted"}`}>
                    {formData.beneficios.length}/300 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Cursos Preferenciais */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Cursos Preferenciais <RequiredFieldTooltip />
                </Form.Label>
                <TagInput
                  value={formData.cursosPreferenciais}
                  onChange={(tags) =>
                    setFormData((prev) => ({ ...prev, cursosPreferenciais: tags }))
                  }
                  placeholder="Escreva os cursos preferenciais (Ex: Engenharia Informática, Ciências da Computação)"
                />
                <div className="d-flex justify-content-between">
                  {formData.cursosPreferenciais.length > 200 && (
                    <span className={style.charterror}>Máximo de 200 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.cursosPreferenciais.length > 200 ? "text-danger" : "text-muted"}`}>
                    {formData.cursosPreferenciais.length}/200 caracteres
                  </small>
                </div>
              </Form.Group>
            </div>
          )}

          {/* Paso 3*/}
          {step === 3 && (
            <div>
              {/* Habilitações Mínimas */}
              <Form.Group>
                <Form.Label className={`${style.label} fw-bold`}>
                  Habilitações Académicas Mínimas <RequiredFieldTooltip />
                </Form.Label>
                <Form.Select
                  className={`${style.formSelect} w-100`}
                  name="habilitacoesMinimas"
                  value={formData.habilitacoesMinimas || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecione o nível de habilitação</option>
                  <option value="1">Nível 1 - 4º ano do Ensino Básico</option>
                  <option value="2">Nível 2 - 6º ano do Ensino Básico</option>
                  <option value="3">Nível 3 - 9º ano do Ensino Básico</option>
                  <option value="4">Nível 4 - Ensino Secundário + Estágio Profissional</option>
                  <option value="5">Nível 5 - Cursos de Especialização Tecnológica (CET)</option>
                  <option value="6">Nível 6 - Licenciatura</option>
                  <option value="7">Nível 7 - Mestrado</option>
                  <option value="8">Nível 8 - Doutoramento</option>
                </Form.Select>
              </Form.Group>


              {/* Competências Técnicas */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Competências Técnicas <RequiredFieldTooltip />
                  </Form.Label>
                <TagInput
                  value={formData.competenciasTecnicas}
                  onChange={(tags) =>
                    setFormData((prev) => ({ ...prev, competenciasTecnicas: tags }))
                  }
                  placeholder="Escreva as competências técnicas essenciais (Ex: Programação, Design Gráfico, Marketing Digital)"
                />
                <div className="d-flex justify-content-between">
                    {Array.isArray(formData.competenciasTecnicas) && formData.competenciasTecnicas.length > 300 && (
                        <span className={style.charterror}>Máximo de 300 caracteres ultrapassado!</span>
                    )}
                    <small className={`ms-auto ${Array.isArray(formData.competenciasTecnicas) && formData.competenciasTecnicas.length > 300 ? "text-danger" : "text-muted"}`}>
                        {Array.isArray(formData.competenciasTecnicas) ? formData.competenciasTecnicas.length : 0}/300 caracteres
                    </small>
                </div>
              </Form.Group>

              {/* Soft Skills */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Competências Pessoais (Soft Skills)
                </Form.Label> 
                <TagInput
                  value={formData.competenciasPessoais}
                  onChange={(tags) =>
                  setFormData((prev) => ({ ...prev, competenciasPessoais: tags }))
                  }
                  placeholder="Escreva as competências pessoais (Ex: Trabalho em equipe, Comunicação, Resolução de problemas)"
                />
                <div className="d-flex justify-content-between">
                  {formData.competenciasPessoais.length > 200 && (
                    <span className={style.charterror}>Máximo de 200 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.competenciasPessoais.length > 200 ? "text-danger" : "text-muted"}`}>
                    {formData.competenciasPessoais.length}/200 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Idiomas y Outros Requisitos */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Idiomas</Form.Label>
                    <TagInput
                      value={formData.idiomas}
                      onChange={(tags) =>
                      setFormData((prev) => ({ ...prev, idiomas: tags }))
                      }
                      placeholder="Escreva os idiomas (Ex: Inglês, Português, Espanhol)"
                    />
                    <div className="d-flex justify-content-between">
                      {formData.idiomas.length > 150 && (
                        <span className={style.charterror}>Máximo de 150 caracteres ultrapassado!</span>
                      )}
                      <small className={`ms-auto ${formData.idiomas.length > 150 ? "text-danger" : "text-muted"}`}>
                        {formData.idiomas.length}/150 caracteres
                      </small>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Observações</Form.Label>
                    <Form.Control
                      type="text"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      placeholder="Requisitos adicionais..."
                      className={`${style.input} ${formData.observacoes.length > 150 ? "is-invalid" : ""}`}
                    />
                    <div className="d-flex justify-content-between">
                      {formData.observacoes.length > 150 && (
                        <span className={style.charterror}>Máximo de 150 caracteres ultrapassado!</span>
                      )}
                      <small className={`ms-auto ${formData.observacoes.length > 150 ? "text-danger" : "text-muted"}`}>
                        {formData.observacoes.length}/150 caracteres
                      </small>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {/* Paso 4 - Confirmar/Revisão */}
          {step === 4 && (
            <div>
              <div
                className={style.reviewSection}
                style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", textAlign: "left" }}
              >
                <div style={{ flex: "1 1 45%" }}>
                  <p><strong>Título:</strong> {formData.title || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Área:</strong> {formData.area ?  formData.area.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Vagas:</strong> {formData.numeroVagas || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Localização:</strong> {formData.localizacao || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Tipo:</strong> {formData.tipoEstagio || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Duração:</strong> {formData.duracao || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Início:</strong> {formData.dataInicio || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Prazo de Candidatura:</strong> {formData.prazoCandidatura || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                </div>
                <div style={{ flex: "1 1 45%" }}>
                  <p><strong>Descrição:</strong> {formData.descricao || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Benefícios:</strong> {formData.beneficios ? formData.beneficios.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Cursos Preferenciais:</strong> {formData.cursosPreferenciais ? formData.cursosPreferenciais.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Habilitações Mínimas:</strong> {formData.habilitacoesMinimas || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Competências Técnicas:</strong> {formData.competenciasTecnicas ? formData.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Competências Pessoais:</strong> {formData.competenciasPessoais ? formData.competenciasPessoais.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Idiomas:</strong> {formData.idiomas ? formData.idiomas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                  <p><strong>Observações:</strong> {formData.observacoes || <span style={{ color: "#aaa" }}> Não especificado.</span>}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="d-flex justify-content-between mt-4">
            <div>
              {step > 1 && (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={loading}
                  className="me-2"
                 style={{ backgroundColor: '#273f4f', color: 'white', border: 'none' }}
                >
                  Voltar
                </Button>
              )}
            </div>
            <div>
              <Button
                variant="outline-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={loading || loadingDelete}
                className="me-2"
                 style={{ backgroundColor: '#273f4f', color: 'white', border: 'none' }}
              >
                {loadingDelete ? "Excluindo Estágio" : "Excluir Estágio"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
                className="me-2"
                style={{ backgroundColor: '#273f4f', color: 'white', border: 'none' }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={loading}
                className="btn-custom"
                style={{ backgroundColor: '#273f4f', color: 'white', border: 'none' }}
              >
                {loading ? "Carregando..." : step === 4 ? "Atualizar Estágio" : "Próximo"}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Modal de confirmação de delete */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar este estágio? Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="btnDanger" onClick={handleDeleteEstagio}>
            Excluir Estágio
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditarEstagio;