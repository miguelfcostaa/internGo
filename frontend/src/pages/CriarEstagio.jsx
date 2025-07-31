import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import style from "../styles/CriarEstagio.module.css";
import { Form, Row, Col, Button, Card, Container } from "react-bootstrap";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";

function CriacaoEstagio() {
  const [step, setStep] = useState(1);

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
    horario: "",
    habilitacao: "",
    cursos: "",
    tecnicas: "",
    pessoais: "",
    idiomas: "",
    outros: "",
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate(-1); // Navega para a página anterior
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <NavBar />
      <h6 className={style.titulo}> Publicar Novo Estágio na sua Empresa</h6>

      <div className={`${style.container} ${style.mt4}`}>
        <div className={`${style.mb4} ${style.borderBottom} ${style.pb2}`}>
          <span className={step === 1 ? style.fwBold : style.textMuted}>
            1. Informações Básicas
          </span>{" "}
          &gt;
          <span
            className={`${step === 2 ? style.fwBold : style.textMuted} ${
              style.mx2
            }`}
          >
            2. Detalhes do Estágio
          </span>{" "}
          &gt;
          <span
            className={`${step === 3 ? style.fwBold : style.textMuted} ${
              style.mx2
            }`}
          >
            3. Requisitos
          </span>{" "}
          &gt;
          <span
            className={`${step === 4 ? style.fwBold : style.textMuted} ${
              style.mx2
            }`}
          >
            4. Revisão
          </span>
        </div>
        {/* Paso 1 */}
        {step === 1 && (
          <Form>
            <Row className={style.mb3}>
              <Col md={6} className={style.leftColumn}>
                <Form.Group className={`${style.mb3} d-flex flex-column`}>
                  <Form.Label className={style.formLabel}>
                    Título do Estágio <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Estágio em Desenvolvimento de Software"
                  />
                </Form.Group>

                <Form.Group className={`${style.mb3} d-flex flex-column`}>
                  <Form.Label className={style.formLabel}>
                    Área(s) de Atuação <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Ex: Tecnologia da Informação"
                  />
                </Form.Group>

                <Form.Group className={`${style.mb3} ${style.inlineField}`}>
                  <Form.Label
                    className={`${style.formLabel} mb-0`}
                    style={{ minWidth: "160px" }}
                  >
                    Número de Vagas <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={style.smallInput}
                    type="number"
                    name="vagas"
                    value={formData.vagas}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </Form.Group>

                <Form.Group className={`${style.mb3} d-flex flex-column`}>
                  <Form.Label className={style.formLabel}>
                    Localização <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    placeholder="Ex: Funchal"
                  />
                </Form.Group>
              </Col>

              <Col md={6} className={style.rightColumn}>
                <div className={style.rightColumnContainer}>
                  {/* Data Início */}
                  <Form.Group className={`${style.mb3} ${style.inlineField}`}>
                    <Form.Label
                      className={style.formLabel}
                      style={{ minWidth: "140px" }}
                    >
                      Data de Início Prevista <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      className={style.smallDate}
                      type="date"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Tipo Estágio */}
                  <Form.Group
                    className={`${style.mb3} d-flex align-items-center`}
                  >
                    <Form.Label
                      className={`${style.formLabel} mb-0 me-3`}
                      style={{ minWidth: "120px" }}
                    >
                      Tipo de Estágio <RequiredFieldTooltip />
                    </Form.Label>
                    <div className={style.radioGroup}>
                      <Form.Check
                        inline
                        label="Presencial"
                        type="radio"
                        name="tipo"
                        value="Presencial"
                        checked={formData.tipo === "Presencial"}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Remoto"
                        type="radio"
                        name="tipo"
                        value="Remoto"
                        checked={formData.tipo === "Remoto"}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Híbrido"
                        type="radio"
                        name="tipo"
                        value="Híbrido"
                        checked={formData.tipo === "Híbrido"}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>

                  {/* Duração */}
                  <Form.Group
                    className={`${style.mb3}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Form.Label
                      className={style.formLabel}
                      style={{ minWidth: "140px", marginBottom: 0 }}
                    >
                      Duração do Estágio <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Select
                      className={style.smallSelect}
                      name="duracao"
                      value={formData.duracao}
                      onChange={handleChange}
                    >
                      <option value="">Duração</option>
                      <option value="3 meses">3 meses</option>
                      <option value="6 meses">6 meses</option>
                      <option value="12 meses">12 meses</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Prazo */}
                  <Form.Group className={`${style.mb3} ${style.inlineField}`}>
                    <Form.Label
                      className={style.formLabel}
                      style={{ minWidth: "140px" }}
                    >
                      Prazo Limite de Candidatura <RequiredFieldTooltip />
                    </Form.Label>
                    <Form.Control
                      className={style.smallDate}
                      type="date"
                      name="prazo"
                      value={formData.prazo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>

            <div
              className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}
            >
              <Button
                variant="secondary"
                className={style.btnSecondary}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className={style.btnPrimary}
                onClick={handleNext}
              >
                Próximo passo
              </Button>
            </div>
          </Form>
        )}

        {/* Paso 2: Detalhes do Estágio */}
        {step === 2 && (
          <Form>
            <Row className={style.mb3}>
              <Col md={12}>
                {/* Descrição do Estágio */}
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Descrição do Estágio <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className={`${style.formControl} w-100`}
                    placeholder="Descreva brevemente as atividades do estágio"
                    name="descricao"
                    value={formData.descricao || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Benefícios Oferecidos */}
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Benefícios Oferecidos <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={`${style.formControl} w-100`}
                    type="text"
                    placeholder="Ex: Bolsa, Vale-transporte"
                    name="beneficios"
                    value={formData.beneficios || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Horário do Estágio */}
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Horário do Estágio <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Control
                    className={`${style.formControl} w-100`}
                    type="text"
                    placeholder="Ex: 9h às 15h"
                    name="horario"
                    value={formData.horario || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div
              className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}
            >
              <Button
                variant="secondary"
                className={style.btnSecondary}
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                className={style.btnPrimary}
                onClick={handleNext}
              >
                Próximo passo
              </Button>
            </div>
          </Form>
        )}
        {/* Paso 3: Requisitos */}
        {step === 3 && (
          <Form>
            <Row className={style.mb3}>
              <Col md={12}>
                {/* Habilitações Académicas Mínimas */}
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Habilitações Académicas Mínimas <RequiredFieldTooltip />
                  </Form.Label>
                  <Form.Select className={style.formSelect}>
                    <option value="">Selecione o nível de habilitação</option>
                    <option value="1">Nível 1 – 4º ano do Ensino Básico</option>
                    <option value="2">Nível 2 – 6º ano do Ensino Básico</option>
                    <option value="3">Nível 3 – 9º ano do Ensino Básico</option>
                    <option value="4">
                      Nível 4 – Ensino Secundário + Estágio Profissional
                    </option>
                    <option value="5">
                      Nível 5 – Cursos de Especialização Tecnológica (CET)
                    </option>
                    <option value="6">Nível 6 – Licenciatura</option>
                    <option value="7">Nível 7 – Mestrado</option>
                    <option value="8">Nível 8 – Doutoramento</option>
                  </Form.Select>
                </Form.Group>

                {/* Curso(s) / Área(s) de Estudo Preferencial(is) */}
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Curso(s) / Área(s) de Estudo Preferencial(is)
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Indique os cursos ou áreas de estudo mais relevantes para esta oportunidade"
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Competências Técnicas Essenciais
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Liste ferramentas e aptidões técnicas essenciais"
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Competências Pessoais (Soft Skills)
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Ex: Que qualidades pessoais são importantes para este estágio"
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>Idiomas</Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Indique os idiomas exigidos (Ex: Inglês avançado, Espanhol básico)"
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Outros Requisitos Específicos
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className={style.formControl}
                    placeholder="Ex: Algum requisito adicional não coberto acima"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div
              className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}
            >
              <Button
                variant="secondary"
                className={style.btnSecondary}
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                className={style.btnPrimary}
                onClick={handleNext}
              >
                Próximo passo
              </Button>
            </div>
          </Form>
        )}

        {/* Paso 4: Revisão */}
        {step === 4 && (
          <Container fluid className="p-0">
            <p className="text-muted mb-3">
              Confirme os dados do seu anúncio para garantir a melhor
              experiência aos candidatos.
            </p>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold">
                      Informações Básicas:{" "}
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setStep(1)}
                      >
                        [ Editar ]
                      </span>
                    </h6>

                    <p>
                      <strong>Título:</strong>{" "}
                    </p>
                    <p>
                      <strong>Áreas:</strong>{" "}
                    </p>
                    <p>
                      <strong>Vagas:</strong>{" "}
                    </p>
                    <p>
                      <strong>Localização:</strong>
                    </p>
                    <p>
                      <strong>Tipo:</strong>{" "}
                    </p>
                    <p>
                      <strong>Início:</strong>{" "}
                    </p>
                    <p>
                      <strong>Duração:</strong>
                    </p>
                    <p>
                      <strong>Prazo Candidaturas:</strong>
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">
                      Detalhes do Estágio{" "}
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setStep(2)}
                      >
                        [ Editar ]
                      </span>
                    </h6>

                    <p>
                      <strong>Habilitações:</strong>
                    </p>
                    <p>
                      <strong>Cursos:</strong>
                    </p>
                    <p>
                      <strong>Técnicas:</strong>
                    </p>
                    <p>
                      <strong>Pessoais:</strong>
                    </p>
                    <p>
                      <strong>Idiomas:</strong>{" "}
                    </p>
                    <p>
                      <strong>Outros:</strong>{" "}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold">
                  Requisitos{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setStep(3)}
                  >
                    [ Editar ]
                  </span>
                </h6>
                <p>
                  <strong>Descrição:</strong>{" "}
                </p>
                <p>
                  <strong>Mentoria:</strong>
                </p>
                <p>
                  <strong>Benefícios:</strong>
                </p>
              </Card.Body>
            </Card>

            <div
              className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}
            >
              <Button
                variant="secondary"
                className={style.btnSecondary}
                onClick={handleBack}
              >
                Voltar
              </Button>
              <div>
                <Button variant="primary" className={style.btnPrimary}>
                  Publicar Estágio
                </Button>
              </div>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
}
export default CriacaoEstagio;
