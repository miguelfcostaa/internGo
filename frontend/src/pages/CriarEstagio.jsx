import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	Alert,
} from "react-bootstrap";
import NavBar from "../components/NavBar";
import style from "../styles/CriarEstagio.module.css";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";
import { criarEstagio } from "../services/apiService";

const CriacaoEstagio = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
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
			competenciasTecnicas: "",
			softSkills: "",
			idiomas: "",
			outrosRequisitos: "",
	});
	//limite de caracteres
	const [Warnings, setWarnings] = useState({
		titulo: false,
		area: false,
		vagas: false,
		localizacao: false,
		dataInicio: false,
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
	//maximo de caracteres e mensagem de erro
	const messageMaxChat = "Atingiu o maximo de caracteres permitido";
	const maxChars = 20;
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (value.length <= maxChars) {
		setFormData((prev) => ({ ...prev, [name]: value }));
		setWarnings((prev) => ({ ...prev, [name]: value.length === maxChars }));
		}
	};

	const handleNext = async () => {
		if (step < 4) {
		setStep(step + 1);
		} else if (step === 4) {
		// Publicar estágio
		await handlePublicarEstagio();
		}
	};

	const handlePublicarEstagio = async () => {
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
			dataInicio: "Mês de início",
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
			throw new Error(
			`Por favor, preencha os seguintes campos obrigatórios: ${camposFaltando.join(
				", "
			)}`
			);
		}

		// Mapear os dados do formulário para o formato esperado pelo backend
		const estagioData = {
			title: formData.titulo,
			area: formData.area,
			dataInicio: formData.dataInicio,
			tipoEstagio: formData.tipo,
			duracao: parseInt(formData.duracao.split(" ")[0]), // Extrair número dos meses
			numeroVagas: parseInt(formData.vagas),
			localizacao: formData.localizacao,
			prazoCandidatura: formData.prazo,
			descricao: formData.descricao,
			oportunidades:
			formData.oportunidades || "Oportunidades de aprendizagem e desenvolvimento profissional",
			beneficios: formData.beneficios,
			habilitacoesMinimas: formData.habilitacoes || "",
			cursosPreferenciais: "", // Campo não presente no formulário
			competenciasEssenciais: formData.competenciasTecnicas || "",
			competenciasPessoais: formData.softSkills || "",
			idiomas: formData.idiomas || "",
			observacoes: formData.outrosRequisitos || "",
		};

		console.log("Dados do estágio a serem enviados:", estagioData);

		const response = await criarEstagio(estagioData);
		if (response.ok) setSuccess("Estágio criado com sucesso!");

		// Aguardar um pouco para mostrar a mensagem de sucesso
		setTimeout(() => {
			// Obter o ID do usuário logado para redirecionar corretamente
			const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
			const userId = userInfo.id || userInfo._id;

			if (userId) {
			navigate(`/estagios-criados/${userId}`);
			} else {
			navigate("/profile/:id");
			}
		}, 2000);
		} catch (error) {
		console.error("Erro ao criar estágio:", error);
		setError(error.message || "Erro ao criar estágio. Tente novamente.");
		} finally {
		setLoading(false);
		}
	};

	const handleBack = () => {
		if (step > 1) setStep(step - 1);
	};

	// Função para formatar o mês, que vem como //YYYY-MM e retorna o nome do mes e o ano
    const handleMesInicio = (mes) => { 
		if (!mes) return "";
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const [ano, mesIndex] = mes.split("-");
        return `${meses[parseInt(mesIndex) - 1]} de ${ano}`;
    }

	return (
		<div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "2rem" }}>
		<NavBar />
		<h6 className={style.titulo}>Publicar Novo Estágio na sua Empresa</h6>

		{/* Mensagens de erro e sucesso */}
		{error && (
			<div className={`${style.errorContainer}`}>
				<Alert  variant="danger" onClose={() => setError("")}>
					{error}
				</Alert>
			</div>
		)}

		{success && (
			<div className={`${style.successContainer}`}>
				<Alert variant="success" onClose={() => setSuccess("")}>
					Estágio criado com sucesso!
				</Alert>
			</div>
		)}

		{/* BARRA DE ETAPAS */}
		<div className={step === 4 ? style.reviewContainer : `${style.container} ${style.mt4}`}>
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

			{/* FORMULÁRIOS POR ETAPA */}
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
					{Warnings["titulo"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
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
					{Warnings["area"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
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
					{Warnings["localizacao"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>
				</Col>

				<Col md={6} className={style.rightColumn}>
					<div className={style.rightColumnContainer}>
					<Form.Group className={`${style.mb3} ${style.inlineField}`}>
						<Form.Label
						className={style.formLabel}
						style={{ minWidth: "140px" }}
						>
						Mês de Início <RequiredFieldTooltip />
						</Form.Label>
						<Form.Control
						className={style.smallDate}
						type="month"
						name="dataInicio"
						value={formData.dataInicio}
						onChange={handleChange}
						/>
					</Form.Group>

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
					onClick={() => navigate("/profile/:id")}
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

			{/* Paso 2*/}

			{step === 2 && (
			<Form>
				<Row className={style.mb3}>
				<Col md={12}>
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
						value={formData.descricao}
						onChange={handleChange}
					/>
					{Warnings["descricao"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>

					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>
						Benefícios Oferecidos <RequiredFieldTooltip />
					</Form.Label>
					<Form.Control
						className={`${style.formControl} w-100`}
						type="text"
						placeholder="Ex: Bolsa, Vale-transporte"
						name="beneficios"
						value={formData.beneficios}
						onChange={handleChange}
					/>
					{Warnings["beneficios"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>

					<Form.Group
					className={`${style.mb3} d-flex align-items-center`}
					>
					<Form.Label className={`${style.formLabel} me-3`}>
						Horário de Estágio <RequiredFieldTooltip />
					</Form.Label>
					<div className="d-flex align-items-center gap-2">
						<Form.Control
						type="time"
						name="horaInicio"
						value={formData.horaInicio}
						onChange={handleChange}
						className="w-auto"
						required
						/>
						<span>até</span>
						<Form.Control
						type="time"
						name="horaFim"
						value={formData.horaFim}
						onChange={handleChange}
						className="w-auto"
						required
						/>
					</div>
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

			{/* Paso 3*/}
			{step === 3 && (
			<Form>
				<Row className={style.mb3}>
				<Col md={12}>
					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>
						Habilitações Académicas Mínimas <RequiredFieldTooltip />
					</Form.Label>
					<Form.Select
						className="w-100"
						name="habilitacoes"
						value={formData.habilitacoes || ""}
						onChange={handleChange}
					>
						<option value="">Selecione o nível de habilitação</option>
						<option value="1">Nível 1 - 4º ano do Ensino Básico</option>
						<option value="2">Nível 2 - 6º ano do Ensino Básico</option>
						<option value="3">Nível 3 - 9º ano do Ensino Básico</option>
						<option value="4">
						Nível 4 - Ensino Secundário + Estágio Profissional
						</option>
						<option value="5">
						Nível 5 - Cursos de Especialização Tecnológica (CET)
						</option>
						<option value="6">Nível 6 - Licenciatura</option>
						<option value="7">Nível 7 - Mestrado</option>
						<option value="8">Nível 8 - Doutoramento</option>
					</Form.Select>
					</Form.Group>

					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>
						Competências Técnicas Essenciais <RequiredFieldTooltip />
					</Form.Label>
					<Form.Control
						className="w-100"
						type="text"
						placeholder="Liste ferramentas e aptidões técnicas essenciais"
						name="competenciasTecnicas"
						value={formData.competenciasTecnicas || ""}
						onChange={handleChange}
					/>
					{Warnings["competenciasTecnicas"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>

					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>
						Competências Pessoais (Soft Skills)
					</Form.Label>
					<Form.Control
						className="w-100"
						type="text"
						placeholder="Ex: Que qualidades pessoais são importantes para este estágio"
						name="softSkills"
						value={formData.softSkills || ""}
						onChange={handleChange}
					/>
					{Warnings["softSkills"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>

					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>Idiomas</Form.Label>
					<Form.Control
						className="w-100"
						type="text"
						placeholder="Indique os idiomas exigidos (Ex: Inglês avançado, Espanhol básico)"
						name="idiomas"
						value={formData.idiomas || ""}
						onChange={handleChange}
					/>
					{Warnings["idiomas"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
					</Form.Group>

					<Form.Group className={style.mb3}>
					<Form.Label className={style.formLabel}>
						Outros Requisitos Específicos
					</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						className="w-100"
						placeholder="Ex: Algum requisito adicional não coberto acima"
						name="outrosRequisitos"
						value={formData.outrosRequisitos || ""}
						onChange={handleChange}
					/>
					{Warnings["outrosRequisitos"] && (
						<span className={style.charterror}>{messageMaxChat}</span>
					)}
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

			{/* Paso 4 */}

			{step === 4 && (
			<Container fluid className="p-0 text-start">
				<p className="fw-bold text-secondary text-start mb-3">
				Revise o Seu Anúncio de Estágio na Empresa <br />
				<span className="fw-normal text-muted">
					Por favor, verifique todos os detalhes antes de publicar. Esta é
					a versão final que os candidatos verão.
				</span>
				</p>

				<Row className="mb-4">
				<Col md={6}>
					<Card className="shadow-sm h-100">
					<Card.Body>
						<h6 className="fw-bold text-dark mb-3">
						1. Informações Básicas{" "}
						<span
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => setStep(1)}
						>
							[ Editar ]
						</span>
						</h6>
						<p>
						<strong className="text-secondary">Título:</strong>{" "}
						{formData.titulo || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Áreas:</strong>{" "}
						{formData.area || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Vagas:</strong>{" "}
						{formData.vagas || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Localização:</strong>{" "}
						{formData.localizacao || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Tipo:</strong>{" "}
						{formData.tipo || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Mês de Início:</strong>{" "}
						{handleMesInicio(formData.dataInicio) || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Duração:</strong>{" "}
						{formData.duracao || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">
							Prazo Candidaturas:
						</strong>{" "}
						{formData.prazo || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
					</Card.Body>
					</Card>
				</Col>

				<Col md={6}>
					<Card className="shadow-sm h-100">
					<Card.Body>
						<h6 className="fw-bold text-dark mb-3">
						2. Requisitos do Candidato{" "}
						<span
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => setStep(3)}
						>
							[ Editar ]
						</span>
						</h6>
						<p>
						<strong className="text-secondary">Habilitações:</strong>{" "}
						{formData.habilitacoes || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">
							Competências Técnicas:
						</strong>{" "}
						{formData.competenciasTecnicas || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Soft Skills:</strong>{" "}
						{formData.softSkills || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">Idiomas:</strong>{" "}
						{formData.idiomas || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
						<strong className="text-secondary">
							Outros Requisitos:
						</strong>{" "}
						{formData.outrosRequisitos || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
					</Card.Body>
					</Card>
				</Col>
				</Row>
				<Card className="shadow-sm mb-4">
					<Card.Body>
						<h6 className="fw-bold text-dark mb-3">
							3. Detalhes do Estágio{" "}
							<span
								className="text-primary"
								style={{ cursor: "pointer" }}
								onClick={() => setStep(2)}
							>
								[ Editar ]
							</span>
						</h6>
						<p>
							<strong className="text-secondary">Descrição:</strong>{" "}
							{formData.descricao || <span style={{ color: "#aaa" }}> Não especificado.</span>}
						</p>
						<p>
							<strong className="text-secondary">
								Mentoria/Aprendizagem:
							</strong>{" "}
							{formData.oportunidades || <span style={{ color: "#aaa" }}> Não especificado.</span>}
							</p>
						<p>
							<strong className="text-secondary">Benefícios:</strong>{" "}
							{formData.beneficios || <span style={{ color: "#aaa" }}> Não especificado.</span>}
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
					<Button
						variant="primary"
						className={style.btnPrimary}
						onClick={handleNext}
						disabled={loading}
					>
						{loading ? "Publicando..." : "Publicar Estágio"}
					</Button>
				</div>
			</Container>
			)}
		</div>
		</div>
	);
};

export default CriacaoEstagio;
