import React from "react";
import NavBar from "../components/NavBar.jsx"; 
import style from "../styles/CriarEstagio.module.css";
import { Form, Row, Col, Button } from 'react-bootstrap';

function CriacaoEstagio() {
  return (
     <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

      <NavBar />
      <h6 className={style.titulo}> Publicar Novo Estágio na sua Empresa</h6>
      <div className={`${style.container} ${style.mt4}`}>
          {/* Abas de progresso */}
          <div className={`${style.mb4} ${style.borderBottom} ${style.pb2}`}>
            <span className={`${style.fwBold} ${style.textPrimary}`}>1. Informações Básicas</span> &gt;
            <span className={`${style.textMuted} ${style.mx2}`}>2. Detalhes do Estágio</span> &gt;
            <span className={`${style.textMuted} ${style.mx2}`}>3. Requisitos</span> &gt;
            <span className={`${style.textMuted} ${style.mx2}`}>4. Revisão</span>
          </div>

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

              <Form.Group className={style.mb3}> {/* Apply a margin/spacing class to the Form.Group */}
              <Form.Label className={style.formLabel}>
                  Número de Vagas para este Estágio <span className={style.textDanger}>*</span>
              </Form.Label>
              <Form.Control
              className={style.formControl} // This is where .formControl belongs
              type="number"
              min="1"
              />
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
              <Button variant="secondary" className={style.btnSecondary}>Guarde Rascunho</Button>
              <div>
                <Button variant="secondary" className={`${style.btnSecondary} ${style.me2}`}>Cancelar</Button>
                <Button variant="primary" className={style.btnPrimary}>Próximo passo</Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
  );
}

export default CriacaoEstagio;
