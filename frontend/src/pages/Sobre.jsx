import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Sobre.module.css";
import "bootstrap/dist/css/bootstrap.min.css";


const Sobre = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="text-center bg-light py-5">
        <Container>
          <h1 className="fw-bold">
            Transformando a procura por estágios em uma experiência simples e acessível
          </h1>
          <p className="lead mt-3">
            Um projeto feito por estagiários, para estagiários, com tecnologia e impacto social positivo.
          </p>
          <Button variant="primary" size="lg" className="mt-3 me-2">
            Encontre seu estágio agora
          </Button>
          <Button variant="outline-primary" size="lg" className="mt-3">
            Saiba mais sobre nós
          </Button>
        </Container>
      </section>

      {/* QUEM SOMOS */}
      <section className="py-5">
        <Container>
          <Row className="mb-4 text-center">
            <h2 className="fw-bold">Quem somos</h2>
            <p className="text-muted">
              O projeto nasce do compromisso da empresa em resolver pequenos problemas do dia a dia com soluções simples e eficazes.
              Como estagiários, queremos partilhar o acesso à informação e às ferramentas que muitos ainda desconhecem.
            </p>
          </Row>
          <Row className="text-center">
            {["Promover pensamento crítico", "Usar tecnologia de ponta", "Estimular colaboração ágil", "Propor soluções aplicáveis e reais"].map(
              (valor, idx) => (
                <Col md={3} key={idx} className="mb-4">
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body>
                      <h5>{valor}</h5>
                    </Card.Body>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Container>
      </section>

      {/* PROBLEMAS IDENTIFICADOS */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="fw-bold text-center mb-4">Problemas que identificamos</h2>
          <Row>
            {[
              "Falta de centralização das informações sobre prazos de candidatura.",
              "Dificuldade em identificar entidades que realmente oferecem programas de estágio.",
              "Pouca clareza sobre remuneração e condições, gerando desigualdade no acesso.",
            ].map((problema, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="shadow-sm h-100 border-0">
                  <Card.Body>
                    <p>{problema}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* NOSSA SOLUÇÃO */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-4">
            <h2 className="fw-bold">Nossa solução</h2>
            <p className="text-muted">
              Ao aplicar tecnologias atuais como <strong>React</strong> e <strong>Node.js</strong>, aliadas a um bom planeamento e trabalho em equipa, criamos uma ferramenta que visa:
            </p>
          </Row>
          <Row className="text-center">
            {[
              "Reduzir a dificuldade na procura e candidatura a estágios.",
              "Promover igualdade de acesso à informação.",
              "Oferecer uma plataforma com aplicabilidade real e impacto social positivo.",
            ].map((solucao, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="shadow-sm h-100 border-0">
                  <Card.Body>
                    <p>{solucao}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* IMPACTO ESPERADO */}
      <section className="bg-primary text-white text-center py-5">
        <Container>
          <h3>
            Este é um passo concreto para transformar um problema comum numa oportunidade de inovação e impacto social positivo.
          </h3>
        </Container>
      </section>

      {/* EQUIPE */}
      <section className="py-5">
        <Container>
          <h2 className="fw-bold text-center mb-4">Nossa equipe</h2>
          <Row className="justify-content-center">
            {[1, 2, 3].map((_, idx) => (
              <Col md={3} key={idx} className="mb-4 text-center">
                <Card className="shadow-sm border-0">
                  <Card.Img variant="top" src="https://via.placeholder.com/150" />
                  <Card.Body>
                    <h5>Membro {idx + 1}</h5>
                    <p className="text-muted">Função</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-5 bg-light">
        <Container>
          <h2 className="fw-bold mb-3">Junte-se a nós e simplifique sua busca por estágios!</h2>
          <Button variant="primary" size="lg" className="me-2">
            Explorar oportunidades
          </Button>
          <Button variant="outline-primary" size="lg">
            Publicar uma vaga
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Sobre;