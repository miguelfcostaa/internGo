import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from "react-bootstrap";
import NavBar from "../components/NavBar";
import style from "../styles/CriarEstagio.module.css";
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
    inicio: "",
    tipo: "",
    duracao: "",
    prazo: "",
    descricao: "",
    beneficios: "",
    horaInicio: "",
    horaFim: "",
    habilitacoes: "",
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
          inicio: estagio.dataInicio || "",
          tipo: estagio.tipoEstagio || "",
          duracao: estagio.duracao ? `${estagio.duracao} ${estagio.duracao === 1 ? "Mês" : "Meses"}` : "",
          prazo: estagio.prazoCandidatura || "",
          descricao: estagio.descricao || "",
          beneficios: estagio.beneficios || "",
          horaInicio: "",
          horaFim: "",
          habilitacoes: estagio.habilitacoesMinimas || "",
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
const messageMaxChat="Atingiu o maximo de caracteres permitido"
  const maxChars = 10;
  const handleChange = (e) => {
    const { name, value } = e.target;
     if (value.length <= maxChars) {
            setFormData((prev) => ({ ...prev, [name]: value }));;
            setWarnings((prev) => ({ ...prev, [name]: value.length === maxChars }));
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
        inicio: "Data de início",
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
        dataInicio: formData.inicio,
        tipoEstagio: formData.tipo,
        duracao: parseInt(formData.duracao.split(" ")[0]),
        numeroVagas: parseInt(formData.vagas),
        localizacao: formData.localizacao,
        prazoCandidatura: formData.prazo,
        descricao: formData.descricao,
        oportunidades: formData.mentoria || "Oportunidades de aprendizagem e desenvolvimento profissional",
        beneficios: formData.beneficios,
        habilitacoesMinimas: formData.habilitacoes || "",
        cursosPreferenciais: "",
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
    <NavBar/>
      {/* Mensagens de erro e sucesso */}
    {error && (
      <div className={`${style.container} ${style.mt4}`}>
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      </div>
    )}

    {success && (
      <div className={`${style.container} ${style.mt4}`}>
        <Alert variant="success">
          {success}
        </Alert>
      </div>
    )}
    
  <Container className="mt-5">
    <div className={`${style.container} ${style.mt4}`}>
      <div className={`${style.mb4} ${style.borderBottom} ${style.pb2}`}>
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
       
       {step === 1 && (
          <div>
            <Form.Group className="mb-3">
              <Form.Label className={style.label}>
                Título do Estágio <RequiredFieldTooltip />
              </Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Estágio em Desenvolvimento Web"
                className={style.input}
              />
              {Warnings["titulo"] && (
                <span className={style.charterror}>
                {messageMaxChat}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={style.label}>
                Área de Atuação <RequiredFieldTooltip />
              </Form.Label>
              <Form.Select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={style.select}
              >
                <option value="">Selecione uma área</option>
                <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                <option value="Marketing Digital">Marketing Digital</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Finanças">Finanças</option>
                <option value="Design">Design</option>
                <option value="Vendas">Vendas</option>
                <option value="Gestão">Gestão</option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className={style.label}>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className={style.label}>
                    Localização <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    placeholder="Ex: Lisboa, Porto, Remoto"
                    className={style.input}
                  />
              {Warnings["localizacao"] && (
                <span className={style.charterror}>
                {messageMaxChat}
                </span>
              )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className={style.label}>
                    Data de Início <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="inicio"
                    value={formData.inicio}
                    onChange={handleChange}
                    className={style.input}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className={style.label}>
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
      </div>
    </Container>

    {/* Modal de confirmação para deletar */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#dc3545" }}>Confirmar Eliminação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem a certeza de que deseja deletar este estágio?</p>
        <p><strong>Título:</strong> {formData.titulo}</p>
        <p style={{ color: "#dc3545", fontSize: "0.9rem", marginTop: "15px" }}>
          <strong>Atenção:</strong> Esta ação não pode ser desfeita. O estágio será removido permanentemente da base de dados.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowDeleteModal(false)}
          disabled={loadingDelete}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDeleteEstagio}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deletando..." : "Deletar Estágio"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);

}

export default EditarEstagio;