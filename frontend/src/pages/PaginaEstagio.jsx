
import NavBar from "../components/NavBar";
import ButtonVoltar from "../components/ButtonVoltar";
import Styles from "../styles/PaginaEstagio.module.css"
import logo from "../assets/logo.jpg"

function PaginaEstagio (){
    return(
        <div>
            <NavBar/>
            <div className={Styles.background}>
                <ButtonVoltar />
                <div style={{marginTop:"50px", display:"flex", flexDirection:"row"}}>
                    <div>
                        <img src={logo} className={Styles.logo}></img>
                    </div>
                    <div style={{width:"80%", marginTop:"15px"}}>
                        <h4 className={Styles.heading}>Nome da empresa</h4>
                        <h4 className={Styles.heading}>Estágio Técnico de Sistemas</h4>
                    </div>
                </div>
                <div className={Styles.bigbox} style={{display:"flex", flexDirection:"row"}}>
                    <div style={{width:"70%"}}>
                        <ul className={Styles.list}>
                            <li className={Styles.listheading}>
                                Área de Atuação:
                                <p className={Styles.description}>Tecnologia da Informação / Infraestrutura de Sistemas.</p>
                            </li>
                            <li className={Styles.listheading}>
                                Cursos Preferenciais/ Áreas de Estudo mais Indicadas
                                <p className={Styles.description}>Engenharia Informática, Técnico de Sistemas e Redes, Tecnologias de Informação, Ciência da Computação</p>
                            </li>
                            <li className={Styles.listheading}>
                                Descrição do Estágio
                                <p className={Styles.description}>
                                    Este estágio visa proporcionar uma experiência prática em ambientes de infraestrutura tecnológica,
                                    com foco em instalação, configuração e manutenção de sistemas e redes.
                                    O estagiário irá trabalhar em conjunto com a equipa técnica em projetos internos e externos, 
                                    adquirindo experiência real em operações de TI.</p>
                            </li>
                            <li className={Styles.listheading}>
                                Competências Técnicas Essenciais
                                <div className={Styles.description}>
                                    <li>Conhecimentos básicos de redes (TCP/IP, DHCP, DNS)</li>
                                    <li>Familiaridade com sistemas operativos Windows e Linux</li>
                                    <li>Instalação e configuração de software e hardware</li>
                                    <li>Noções de segurança da informação</li>
                                    <li>Capacidade de resolver problemas técnicos</li>
                                </div>
                            </li>
                            <li className={Styles.listheading}>
                                Competências Pessoais (Soft Skills)
                                <div className={Styles.description}>
                                    <li>Proatividade</li>
                                    <li>Boa comunicação e trabalho em equipa</li>
                                    <li>Capacidade de aprendizagem contínua</li>
                                    <li>Gestão de tempo e organização</li>
                                    <li>Responsabilidade e ética profissional</li>
                                </div>
                            </li>
                            <li className={Styles.listheading}>
                                Idiomas
                                <div className={Styles.description}>
                                    <li>Português</li>
                                    <li>Inglês</li>
                                    <li>Espanhol</li>
                                    <li>Alemão</li>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={Styles.sidebar}>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Prazo da Candidatura:
                                <span className={Styles.descriptionsidebar}>10/9/2024</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Local de estágio:
                                <span className={Styles.descriptionsidebar}>Ribeira Brava, Madeira.</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Ínicio do Estágio:
                                <span className={Styles.descriptionsidebar}>1/10/2024</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Duração:
                                <span className={Styles.descriptionsidebar}>1 Mês.</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Número de Vagas:
                                <span className={Styles.descriptionsidebar}>10 vagas disponivéis.</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Horas de Trabalho:
                                <span className={Styles.descriptionsidebar}>8h diárias, com 1 hora de almoço.</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Horário:
                                <span className={Styles.descriptionsidebar}>9h-13h | 14h-18h</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Tipo de Estágio:
                                <span className={Styles.descriptionsidebar}>Renumerado</span>
                            </p>
                        </div>
                        <div className={Styles.margin}>
                            <p className={Styles.heading}>Beneficios oferecidos:
                                <span className={Styles.descriptionsidebar}>Almoço e Transporte</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaginaEstagio;