import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from "react-bootstrap";
import NavBar from "../components/NavBar";
import style from "../styles/CriarEstagio.module.css";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";

const EditarEstagio = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID do estágio a ser editado
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

  // Carregar dados do estágio existente
  useEffect(() => {
    const carregarEstagio = async () => {
      try {
        setLoadingData(true);
        const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do estágio");
        }

        const estagio = await response.json();
        
        // Mapear os dados do backend para o formato do formulário
        setFormData({
          titulo: estagio.title || "",
          area: estagio.area || "",
          vagas: estagio.numeroVagas?.toString() || "",
          localizacao: estagio.localizacao || "",
          inicio: estagio.dataInicio || "",
          tipo: estagio.tipoEstagio || "",
          duracao: estagio.duracao ? `${estagio.duracao} ${estagio.duracao === 1 ? 'Mês' : 'Meses'}` : "",
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
        console.error('Erro ao carregar estágio:', error);
        setError("Erro ao carregar dados do estágio. Tente novamente.");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      carregarEstagio();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Atualizar estágio
      await handleAtualizarEstagio();
    }
  };

  const handleAtualizarEstagio = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validar campos obrigatórios
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
        beneficios: "Benefícios oferecidos"
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

      // Mapear os dados do formulário para o formato esperado pelo backend
      const estagioData = {
        title: formData.titulo,
        area: formData.area,
        dataInicio: formData.inicio,
        tipoEstagio: formData.tipo,
        duracao: parseInt(formData.duracao.split(' ')[0]), // Extrair número dos meses
        numeroVagas: parseInt(formData.vagas),
        localizacao: formData.localizacao,
        prazoCandidatura: formData.prazo,
        descricao: formData.descricao,
        oportunidades: formData.mentoria || "Oportunidades de aprendizagem e desenvolvimento profissional",
        beneficios: formData.beneficios,
        habilitacoesMinimas: formData.habilitacoes || "",
        cursosPreferenciais: "", // Campo não presente no formulário
        competenciasEssenciais: formData.competenciasTecnicas || "",
        competenciasPessoais: formData.softSkills || "",
        idiomas: formData.idiomas || "",
        observacoes: formData.outrosRequisitos || ""
      };

      console.log('Dados do estágio a serem atualizados:', estagioData);

      // Debug: verificar o token e ID do usuário
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Dados do token:', {
          userId: payload.id,
          role: payload.role,
          estagioId: id
        });
      }

      const response = await fetch(`http://localhost:5000/api/estagios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(estagioData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erro do servidor:', errorData);
        throw new Error(errorData.message || "Erro ao atualizar estágio");
      }

      setSuccess("Estágio atualizado com sucesso!");
      
      // Obter o ID do usuário logado para redirecionar corretamente
      const userToken = localStorage.getItem('token');
      if (userToken) {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        const userId = payload.id;
        // Redirecionar imediatamente para a página de estágios criados
        navigate(`/estagios-criados/${userId}`);
      } else {
        navigate("/profile");
      }

    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      setError(error.message || "Erro ao atualizar estágio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erro do servidor:', errorData);
        throw new Error(errorData.message || "Erro ao deletar estágio");
      }

      setSuccess("Estágio deletado com sucesso!");
      setShowDeleteModal(false);
      
      // Redirecionar para a página de estágios criados após deletar
      setTimeout(() => {
        const userToken = localStorage.getItem('token');
        if (userToken) {
          const payload = JSON.parse(atob(userToken.split('.')[1]));
          const userId = payload.id;
          navigate(`/estagios-criados/${userId}`);
        } else {
          navigate("/profile");
        }
      }, 1500);

    } catch (error) {
      console.error('Erro ao deletar estágio:', error);
      setError(error.message || "Erro ao deletar estágio. Tente novamente.");
      setShowDeleteModal(false);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <NavBar />
        <Container className="mt-5">
          <div className="text-center">
            <p>Carregando dados do estágio...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <NavBar />
      <h6 className={style.titulo}>Editar Estágio</h6>

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

      <Container className={style.container}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className={style.card}>
              <Card.Body>
                {/* Indicador de progresso */}
                <div className={style.progressContainer}>
                  <div className={style.progressBar}>
                    <div
                      className={style.progressFill}
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className={style.progressText}>
                    Passo {step} de 4: {
                      step === 1 ? "Informações Básicas" :
                      step === 2 ? "Detalhes da Posição" :
                      step === 3 ? "Requisitos" :
                      "Revisão e Publicação"
                    }
                  </p>
                </div>

                <Form>
                  {step === 1 && (
                    <div>
                      <h5 className={style.stepTitle}>Informações Básicas do Estágio</h5>
                      
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

                  {step === 2 && (
                    <div>
                      <h5 className={style.stepTitle}>Detalhes da Posição</h5>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className={style.label}>
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
                              <option value="4 Meses">4 Meses</option>
                              <option value="5 Meses">5 Meses</option>
                              <option value="6 Meses">6 Meses</option>
                              <option value="9 Meses">9 Meses</option>
                              <option value="12 Meses">12 Meses</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className={style.label}>
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
                          className={style.textarea}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={style.label}>
                          Benefícios Oferecidos <RequiredFieldTooltip />
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="beneficios"
                          value={formData.beneficios}
                          onChange={handleChange}
                          placeholder="Ex: Bolsa de estágio, subsídio de alimentação, seguro..."
                          className={style.textarea}
                        />
                      </Form.Group>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h5 className={style.stepTitle}>Requisitos e Competências</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className={style.label}>Habilitações Mínimas</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="habilitacoes"
                          value={formData.habilitacoes}
                          onChange={handleChange}
                          placeholder="Ex: Estudante do ensino superior em..."
                          className={style.textarea}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={style.label}>Competências Técnicas</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="competenciasTecnicas"
                          value={formData.competenciasTecnicas}
                          onChange={handleChange}
                          placeholder="Ex: JavaScript, Python, HTML/CSS..."
                          className={style.textarea}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className={style.label}>Soft Skills</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="softSkills"
                          value={formData.softSkills}
                          onChange={handleChange}
                          placeholder="Ex: Trabalho em equipa, comunicação, proatividade..."
                          className={style.textarea}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className={style.label}>Idiomas</Form.Label>
                            <Form.Control
                              type="text"
                              name="idiomas"
                              value={formData.idiomas}
                              onChange={handleChange}
                              placeholder="Ex: Português (nativo), Inglês (B2)"
                              className={style.input}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className={style.label}>Outros Requisitos</Form.Label>
                            <Form.Control
                              type="text"
                              name="outrosRequisitos"
                              value={formData.outrosRequisitos}
                              onChange={handleChange}
                              placeholder="Requisitos adicionais..."
                              className={style.input}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h5 className={style.stepTitle}>Revisão e Atualização</h5>
                      <div className={style.reviewSection}>
                        <p><strong>Título:</strong> {formData.titulo}</p>
                        <p><strong>Área:</strong> {formData.area}</p>
                        <p><strong>Vagas:</strong> {formData.vagas}</p>
                        <p><strong>Localização:</strong> {formData.localizacao}</p>
                        <p><strong>Tipo:</strong> {formData.tipo}</p>
                        <p><strong>Duração:</strong> {formData.duracao}</p>
                        <p><strong>Início:</strong> {formData.inicio}</p>
                        <p><strong>Prazo de Candidatura:</strong> {formData.prazo}</p>
                        <p><strong>Descrição:</strong> {formData.descricao}</p>
                        <p><strong>Benefícios:</strong> {formData.beneficios}</p>
                      </div>
                      
                      {/* Botão de deletar estágio */}
                      <div className="mt-4 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                        <h6 style={{ color: "#dc3545", marginBottom: "15px" }}>Zona de Perigo</h6>
                        <p style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "15px" }}>
                          Deletar este estágio irá removê-lo permanentemente da base de dados. Esta ação não pode ser desfeita.
                        </p>
                        <Button
                          variant="danger"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={loadingDelete}
                          style={{ fontSize: "0.9rem" }}
                        >
                          {loadingDelete ? "Deletando..." : "Deletar Estágio"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Botões de navegação */}
                  <div className={style.buttonContainer}>
                    <div className={style.leftButtons}>
                      {step > 1 && (
                        <Button
                          variant="outline-secondary"
                          onClick={handleBack}
                          className={style.backButton}
                        >
                          Voltar
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        onClick={handleCancel}
                        className={style.cancelButton}
                      >
                        Cancelar
                      </Button>
                    </div>
                    
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={loading}
                      className={style.nextButton}
                    >
                      {loading ? "Atualizando..." : step === 4 ? "Atualizar Estágio" : "Próximo"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
    </div>
  );
};

export default EditarEstagio;
