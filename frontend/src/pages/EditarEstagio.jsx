import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";
import NavBar from "../components/NavBar";
import style from "../styles/EditarEstagio.module.css";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    vagas: "",
    localizacao: "",
    dataInicio: "",
    tipo: "",
    duracao: "",
    prazo: "",
    descricao: "",
    beneficios: "",
    horaInicio: "",
    horaFim: "",
    habilitacoes: "",
    cursosPreferenciais: "",
    competenciasTecnicas: "",
    softSkills: "",
    idiomas: "",
    outrosRequisitos: "",
  });
  //limite de cratcteres
  const [Warnings, setWarnings] = useState({
    titulo: false,
    area: false,
    vagas: false,
    localizacao: false,
    inicio: false,
    tipo: false,
    duracao: false,
    prazo: false,
    descricao: false,
    beneficios: false,
    horaInicio: false,
    horaFim: false,
    habilitacoes: false,
    competenciasTecnicas: false,
    softSkills: false,
    idiomas: false,
    outrosRequisitos: false,
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
          titulo: estagio.title || "",
          area: estagio.area || "",
          vagas: estagio.numeroVagas?.toString() || "",
          localizacao: estagio.localizacao || "",
          dataInicio: estagio.dataInicio || "",
          tipo: estagio.tipoEstagio || "",
          duracao: estagio.duracao ? `${estagio.duracao} ${estagio.duracao === 1 ? "Mês" : "Meses"}` : "",
          prazo: estagio.prazoCandidatura || "",
          descricao: estagio.descricao || "",
          beneficios: estagio.beneficios || "",
          horaInicio: "",
          horaFim: "",
          habilitacoes: estagio.habilitacoesMinimas || "",
          cursosPreferenciais: estagio.cursosPreferenciais || "",
          competenciasTecnicas: estagio.competenciasEssenciais || "",
          softSkills: estagio.competenciasPessoais || "",
          idiomas: estagio.idiomas || "",
          outrosRequisitos: estagio.observacoes || "",
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
    titulo: 60,
    localizacao: 40,
    area: 30,
    descricao: 500,
    beneficios: 300,
    competenciasTecnicas: 300,
    cursosPreferenciais: 200,
    softSkills: 200,
    idiomas: 150,
    outrosRequisitos: 150,
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

    try {
      const camposObrigatorios = {
        titulo: "Título do estágio",
        area: "Área de atuação",
        vagas: "Número de vagas",
        localizacao: "Localização",
        dataInicio: "Data de início",
        tipo: "Tipo de estágio",
        duracao: "Duração do estágio",
        prazo: "Prazo limite de candidatura",
        descricao: "Descrição do estágio",
        beneficios: "Benefícios oferecidos",
      };

      const camposFaltando = [];
      for (const [campo, nome] of Object.entries(camposObrigatorios)) {
        if (!formData[campo] || formData[campo].trim() === "") {
          camposFaltando.push(nome);
        }
      }

      if (camposFaltando.length > 0) {
        throw new Error(`Por favor, preencha os seguintes campos obrigatórios: ${camposFaltando.join(", ")}`);
      }

      const estagioData = {
        title: formData.titulo,
        area: formData.area,
        dataInicio: formData.dataInicio,
        tipoEstagio: formData.tipo,
        duracao: parseInt(formData.duracao.split(" ")[0]),
        numeroVagas: parseInt(formData.vagas),
        localizacao: formData.localizacao,
        prazoCandidatura: formData.prazo,
        descricao: formData.descricao,
        oportunidades: formData.mentoria || "Oportunidades de aprendizagem e desenvolvimento profissional",
        beneficios: formData.beneficios,
        habilitacoesMinimas: formData.habilitacoes || "",
        cursosPreferenciais: formData.cursosPreferenciais || "",
        competenciasEssenciais: formData.competenciasTecnicas || "",
        competenciasPessoais: formData.softSkills || "",
        idiomas: formData.idiomas || "",
        observacoes: formData.outrosRequisitos || "",
      };

      const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(estagioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar estágio");
      }

      setSuccess("Estágio atualizado com sucesso!");

      const userToken = localStorage.getItem("token");
      if (userToken) {
        const payload = JSON.parse(atob(userToken.split(".")[1]));
        const userId = payload.id;
        navigate(`/estagios-criados/${userId}`);
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Erro ao atualizar estágio:", error);
      setError(error.message || "Erro ao atualizar estágio. Tente novamente.");
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
      {error && (
        <div className={`${style.container} ${style.mt4}`}>
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        </div>
      )}
      {success && (
        <div className={`${style.container} ${style.mt4}`}>
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
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
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Estágio em Desenvolvimento Web"
                  className={`${style.input} ${formData.titulo.length > 60 ? "is-invalid" : ""}`}
                />
                <div className="d-flex justify-content-between">
                  {formData.titulo.length > 60 && (
                    <span className={style.charterror}>Máximo de 60 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.titulo.length > 60 ? "text-danger" : "text-muted"}`}>
                    {formData.titulo.length}/60 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Área de Atuação */}
              <Form.Group className="mb-3">
                <Form.Label className={`${style.label} fw-bold`}>
                  Área de Atuação <RequiredFieldTooltip />
                </Form.Label>
                <Form.Control
                            className={`${style.formControl} ${formData.area.length > 30 ? "is-invalid" : ""}`}
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Ex: Tecnologia da Informação"
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
                      name="vagas"
                      value={formData.vagas}
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
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className={style.select}
                    >
                      <option value="">Selecione o tipo</option>
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
                    <Form.Select
                      name="duracao"
                      value={formData.duracao}
                      onChange={handleChange}
                      className={style.select}
                    >
                      <option value="">Selecione a duração</option>
                      <option value="1 Mês">1 Mês</option>
                      <option value="2 Meses">2 Meses</option>
                      <option value="3 Meses">3 Meses</option>
                    </Form.Select>
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
                      name="prazo"
                      value={formData.prazo}
                      onChange={handleChange}
                      className={style.input}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Descrição do Estágio */}
              <Form.Group className="mb-3">
                <Form.Label className={style.label}>
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
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="beneficios"
                  value={formData.beneficios}
                  onChange={handleChange}
                  placeholder="Ex: Bolsa de estágio, subsídio de alimentação, seguro..."
                  className={`${style.textarea} ${formData.beneficios.length > 300 ? "is-invalid" : ""}`}
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
                <Form.Control
                  type="text"
                  name="cursosPreferenciais"
                  value={formData.cursosPreferenciais}
                  onChange={handleChange}
                  placeholder="Ex: Engenharia Informática, Ciências da Computação, Sistemas de Informação"
                  className={`${style.input} ${formData.cursosPreferenciais.length > 200 ? "is-invalid" : ""}`}
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
                  name="habilitacoes"
                  value={formData.habilitacoes || ""}
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
                  Competências Técnicas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="competenciasTecnicas"
                  value={formData.competenciasTecnicas}
                  onChange={handleChange}
                  placeholder="Ex: JavaScript, Python, HTML/CSS..."
                  className={`${style.textarea} ${formData.competenciasTecnicas.length > 300 ? "is-invalid" : ""}`}
                />
                <div className="d-flex justify-content-between">
                  {formData.competenciasTecnicas.length > 300 && (
                    <span className={style.charterror}>Máximo de 300 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.competenciasTecnicas.length > 300 ? "text-danger" : "text-muted"}`}>
                    {formData.competenciasTecnicas.length}/300 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Soft Skills */}
              <Form.Group className="mb-3">
              <Form.Label className={`${style.label} fw-bold`}>
                  Soft Skills</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="softSkills"
                  value={formData.softSkills}
                  onChange={handleChange}
                  placeholder="Ex: Trabalho em equipa, comunicação, proatividade..."
                  className={`${style.textarea} ${formData.softSkills.length > 200 ? "is-invalid" : ""}`}
                />
                <div className="d-flex justify-content-between">
                  {formData.softSkills.length > 200 && (
                    <span className={style.charterror}>Máximo de 200 caracteres ultrapassado!</span>
                  )}
                  <small className={`ms-auto ${formData.softSkills.length > 200 ? "text-danger" : "text-muted"}`}>
                    {formData.softSkills.length}/200 caracteres
                  </small>
                </div>
              </Form.Group>

              {/* Idiomas y Outros Requisitos */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className={`${style.label} fw-bold`}>
                      Idiomas</Form.Label>
                    <Form.Control
                      type="text"
                      name="idiomas"
                      value={formData.idiomas}
                      onChange={handleChange}
                      placeholder="Ex: Português (nativo), Inglês (B2)"
                      className={`${style.input} ${formData.idiomas.length > 150 ? "is-invalid" : ""}`}
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
                      Outros Requisitos</Form.Label>
                    <Form.Control
                      type="text"
                      name="outrosRequisitos"
                      value={formData.outrosRequisitos}
                      onChange={handleChange}
                      placeholder="Requisitos adicionais..."
                      className={`${style.input} ${formData.outrosRequisitos.length > 150 ? "is-invalid" : ""}`}
                    />
                    <div className="d-flex justify-content-between">
                      {formData.outrosRequisitos.length > 150 && (
                        <span className={style.charterror}>Máximo de 150 caracteres ultrapassado!</span>
                      )}
                      <small className={`ms-auto ${formData.outrosRequisitos.length > 150 ? "text-danger" : "text-muted"}`}>
                        {formData.outrosRequisitos.length}/150 caracteres
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
                  <p><strong>Título:</strong> {formData.titulo}</p>
                  <p><strong>Área:</strong> {formData.area}</p>
                  <p><strong>Vagas:</strong> {formData.vagas}</p>
                  <p><strong>Localização:</strong> {formData.localizacao}</p>
                  <p><strong>Tipo:</strong> {formData.tipo}</p>
                  <p><strong>Duração:</strong> {formData.duracao}</p>
                  <p><strong>Início:</strong> {formData.dataInicio}</p>
                  <p><strong>Prazo de Candidatura:</strong> {formData.prazo}</p>
                </div>
                <div style={{ flex: "1 1 45%" }}>
                  <p><strong>Descrição:</strong> {formData.descricao}</p>
                  <p><strong>Benefícios:</strong> {formData.beneficios}</p>
                  <p><strong>Cursos Preferenciais:</strong> {formData.cursosPreferenciais}</p>
                  <p><strong>Habilitações Mínimas:</strong> {formData.habilitacoes}</p>
                  <p><strong>Competências Técnicas:</strong> {formData.competenciasTecnicas}</p>
                  <p><strong>Soft Skills:</strong> {formData.softSkills}</p>
                  <p><strong>Idiomas:</strong> {formData.idiomas}</p>
                  <p><strong>Outros Requisitos:</strong> {formData.outrosRequisitos}</p>
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