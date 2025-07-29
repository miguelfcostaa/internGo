import React, { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import style from "../styles/CriarEstagio.module.css";
import { Form, Row, Col, Button } from "react-bootstrap";

function CriacaoEstagio() {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <NavBar />
      <h6 className={style.titulo}> Publicar Novo Estágio na sua Empresa</h6>

      <div className={`${style.container} ${style.mt4}`}>
        {/* Barra de progresso */}
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

        {/* Paso 1: Informações Básicas */}
        {step === 1 && (
          <Form>
            <Row className={style.mb3}>
              <Col md={6}>
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Título do Estágio <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Ex: Estágio em Desenvolvimento de Software"
                    required
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Área(s) de Atuação <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Ex: Tecnologia da Informação"
                    required
                  />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <div className={style.inlineField}>
                    <Form.Label className={style.formLabel}>
                      Número de Vagas para este Estágio <span className={style.textDanger}>*</span>
                    </Form.Label>
                    <Form.Control
                      className={style.smallInput}
                      type="number"
                      min="1"
                      max="999"
                      maxLength="3"
                      placeholder="0"
                    />
                  </div>
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Localização(ões) do Estágio <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Control
                    className={style.formControl}
                    type="text"
                    placeholder="Ex: Funchal"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Data de Início Prevista <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Control className={style.formControl} type="date" required />
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Tipo de Estágio <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <div>
                    <Form.Check inline label="Presencial" name="tipoEstagio" type="radio" />
                    <Form.Check inline label="Remoto" name="tipoEstagio" type="radio" />
                    <Form.Check inline label="Híbrido" name="tipoEstagio" type="radio" defaultChecked />
                  </div>
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Duração do Estágio <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Select className={style.formSelect}>
                    <option>Selecione a duração</option>
                    <option>3 meses</option>
                    <option>6 meses</option>
                    <option>12 meses</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className={style.mb3}>
                  <Form.Label className={style.formLabel}>
                    Prazo Limite para Candidaturas <span className={style.textDanger}>*</span>
                  </Form.Label>
                  <Form.Control className={style.formControl} type="date" required />
                </Form.Group>
              </Col>
            </Row>

            <div className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}>
              <Button variant="secondary" className={style.btnSecondary}>
                Guarde Rascunho
              </Button>
              <div>
                <Button variant="secondary" className={`${style.btnSecondary} ${style.me2}`}>
                  Cancelar
                </Button>
                <Button variant="primary" className={style.btnPrimary} onClick={handleNext}>
                  Próximo passo
                </Button>
              </div>
            </div>
          </Form>
        )}

      
        {/* Paso 2: Detalhes do Estágio */}
        {step === 2 && (
        <Form>
        <Row className={style.mb3}>
        <Col md={12}>
        <Form.Group className={style.mb3}>
          <Form.Label className={style.formLabel}>
            Descrição do Estágio <span className={style.textDanger}>*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            className={style.formControl}
            placeholder="Descreva brevemente as atividades do estágio"
            required
          />
        </Form.Group>

        <Form.Group className={style.mb3}>
          <Form.Label className={style.formLabel}>
            Benefícios Oferecidos <span className={style.textDanger}>*</span>
          </Form.Label>
          <Form.Control
            className={style.formControl}
            type="text"
            placeholder="Ex: Bolsa, Vale-transporte"
            required
          />
        </Form.Group>

        <Form.Group className={style.mb3}>
          <Form.Label className={style.formLabel}>
            Horário do Estágio <span className={style.textDanger}>*</span>
          </Form.Label>
          <Form.Control
            className={style.formControl}
            type="text"
            placeholder="Ex: 9h às 15h"
            required
          />
        </Form.Group>
      </Col>
    </Row>

    <div className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}>
      <Button variant="secondary" className={style.btnSecondary} onClick={handleBack}>
        Voltar
      </Button>
      <Button variant="primary" className={style.btnPrimary} onClick={handleNext}>
        Próximo passo
      </Button>
    </div>
  </Form>
)}
        {/* Paso 3: Requisitos */}
        {step === 3 && (
          <div>
            <p>Conteúdo de "Requisitos" (a definir)</p>
            <div className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}>
              <Button variant="secondary" className={style.btnSecondary} onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="primary" className={style.btnPrimary} onClick={handleNext}>
                Próximo passo
              </Button>
            </div>
          </div>
        )}

        {/* Paso 4: Revisão */}
        {step === 4 && (
          <div>
            <p>Conteúdo de "Revisão" (a definir)</p>
            <div className={`${style.dFlex} ${style.justifyContentBetween} ${style.mt4}`}>
              <Button variant="secondary" className={style.btnSecondary} onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="success" className={style.btnPrimary}>
                Publicar Estágio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CriacaoEstagio;
