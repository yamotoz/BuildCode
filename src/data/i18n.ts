/**
 * BuildCode — Internationalization (i18n)
 * Traduções PT-BR ↔ EN para todo o sistema.
 *
 * Para adicionar novo texto traduzível:
 * 1. Adicione a chave aqui em ambos os idiomas
 * 2. No HTML, use: <span data-i18n="sua.chave">Texto padrão PT</span>
 * O script i18n.js troca automaticamente.
 */

export const translations: Record<string, Record<string, string>> = {
  // ══════════════════════════════════
  //  HEADER / NAV
  // ══════════════════════════════════
  "nav.criador": { pt: "Criador", en: "Creator" },
  "nav.precos": { pt: "Preços", en: "Pricing" },
  "nav.analytics": { pt: "Analytics", en: "Analytics" },
  "nav.biblioteca": { pt: "Biblioteca", en: "Library" },
  "nav.login": { pt: "Login", en: "Login" },
  "nav.acessar": { pt: "Acessar Sistema", en: "Access System" },

  // ══════════════════════════════════
  //  HERO
  // ══════════════════════════════════
  "hero.badge": { pt: "IA-Powered Architecture", en: "AI-Powered Architecture" },
  "hero.title.1": { pt: "Engenharia de ", en: "Elite " },
  "hero.title.highlight": { pt: "Elite", en: "Engineering" },
  "hero.title.2": { pt: " para Projetos Visionários", en: " for Visionary Projects" },
  "hero.subtitle": {
    pt: "A arquitetura perfeita para o seu software começa com decisões inteligentes. Use IA para selecionar stacks, mitigar riscos e escalar com integridade.",
    en: "The perfect architecture for your software starts with smart decisions. Use AI to select stacks, mitigate risks, and scale with integrity."
  },
  "hero.cta.primary": { pt: "Acessar Sistema", en: "Access System" },
  "hero.cta.secondary": { pt: "Ver Demonstração", en: "Watch Demo" },

  // Hero Terminal Mock
  "hero.terminal.1": { pt: "Analyzing project requirements...", en: "Analyzing project requirements..." },
  "hero.terminal.2": { pt: "Expected user load: 1M+ active users", en: "Expected user load: 1M+ active users" },
  "hero.terminal.3": { pt: "Data processing: Real-time", en: "Data processing: Real-time" },
  "hero.terminal.4": { pt: "Evaluating architectural patterns...", en: "Evaluating architectural patterns..." },
  "hero.terminal.5": { pt: "Generating optimal tech stack...", en: "Generating optimal tech stack..." },
  "hero.terminal.recommended": { pt: "Recommended Architecture", en: "Recommended Architecture" },

  // ══════════════════════════════════
  //  PROBLEMA SECTION
  // ══════════════════════════════════
  "problema.title.1": { pt: "O Problema da ", en: "The " },
  "problema.title.highlight": { pt: "Arquitetura", en: "Architecture" },
  "problema.title.2": { pt: "", en: " Problem" },
  "problema.subtitle": {
    pt: "Escolher a tecnologia errada custa tempo, dinheiro e sanidade. A falta de visão sistêmica leva ao caos no desenvolvimento.",
    en: "Choosing the wrong technology costs time, money and sanity. Lack of systemic vision leads to development chaos."
  },
  "problema.card1.title": { pt: "Decisões Descentralizadas", en: "Decentralized Decisions" },
  "problema.card1.desc": {
    pt: "Falta de coesão e padronização entre times. Cada equipe escolhe uma tecnologia diferente, criando um Frankenstein arquitetural impossível de manter.",
    en: "Lack of cohesion and standardization across teams. Each team picks a different technology, creating an architectural Frankenstein impossible to maintain."
  },
  "problema.card2.title": { pt: "Confusão de Stack", en: "Stack Confusion" },
  "problema.card2.desc": {
    pt: "Excesso de tecnologias sem necessidade clara. Adotar ferramentas apenas porque são 'hype', ignorando os reais requisitos do projeto.",
    en: "Too many technologies without clear need. Adopting tools just because they're 'hyped', ignoring the project's real requirements."
  },
  "problema.card3.title": { pt: "Débito de Escalabilidade", en: "Scalability Debt" },
  "problema.card3.desc": {
    pt: "Custos altos e lentidão para escalar o sistema. Quando o sucesso chega, a arquitetura cede e o refatoramento custa meses de trabalho.",
    en: "High costs and slowness to scale the system. When success arrives, the architecture crumbles and refactoring costs months of work."
  },

  // ══════════════════════════════════
  //  SOLUÇÃO SECTION
  // ══════════════════════════════════
  "solucao.badge": { pt: "Solução Estruturada", en: "Structured Solution" },
  "solucao.title.1": { pt: "A stack perfeita, ", en: "The perfect stack, " },
  "solucao.title.2": { pt: "escolhida por IA", en: "chosen by AI" },
  "solucao.subtitle": {
    pt: "Nossa IA avalia os requisitos de negócio, restrições técnicas e metas de longo prazo para recomendar a arquitetura ideal, gerando documentação completa em minutos.",
    en: "Our AI evaluates business requirements, technical constraints, and long-term goals to recommend the ideal architecture, generating complete documentation in minutes."
  },
  "solucao.feature1.title": { pt: "Seleção de Stack via IA", en: "AI-Powered Stack Selection" },
  "solucao.feature1.desc": {
    pt: "Algoritmos avançados que analisam trade-offs e mitigam riscos técnicos antes da primeira linha de código.",
    en: "Advanced algorithms that analyze trade-offs and mitigate technical risks before the first line of code."
  },
  "solucao.feature2.title": { pt: "Geração Automatizada de PRD", en: "Automated PRD Generation" },
  "solucao.feature2.desc": {
    pt: "Documentos de requisitos detalhados (PRD) gerados instantaneamente, alinhando engenharia e produto.",
    en: "Detailed requirements documents (PRD) generated instantly, aligning engineering and product."
  },

  // ══════════════════════════════════
  //  BENEFÍCIOS SECTION
  // ══════════════════════════════════
  "beneficios.title": { pt: "Benefícios a longo prazo", en: "Long-term Benefits" },
  "beneficios.subtitle": {
    pt: "Construa uma base sólida para o futuro. Sistemas que nascem com a arquitetura certa escalam sem fricção.",
    en: "Build a solid foundation for the future. Systems born with the right architecture scale without friction."
  },
  "beneficios.seguranca.title": { pt: "Segurança", en: "Security" },
  "beneficios.seguranca.desc": {
    pt: "Mitigação proativa de vulnerabilidades com escolhas sólidas e validadas pela indústria.",
    en: "Proactive vulnerability mitigation with solid, industry-validated choices."
  },
  "beneficios.escala.title": { pt: "Escalabilidade", en: "Scalability" },
  "beneficios.escala.desc": {
    pt: "Arquitetura resiliente pronta para suportar de centenas a milhões de usuários simultâneos.",
    en: "Resilient architecture ready to support hundreds to millions of simultaneous users."
  },
  "beneficios.clareza.title": { pt: "Clareza", en: "Clarity" },
  "beneficios.clareza.desc": {
    pt: "Visão cristalina do roadmap técnico, alinhando engenharia com objetivos de negócios.",
    en: "Crystal clear vision of the technical roadmap, aligning engineering with business goals."
  },
  "beneficios.educacao.title": { pt: "Educação", en: "Education" },
  "beneficios.educacao.desc": {
    pt: "Aprenda as melhores práticas de engenharia durante o processo de estruturação.",
    en: "Learn engineering best practices during the structuring process."
  },

  // ══════════════════════════════════
  //  CTA FINAL
  // ══════════════════════════════════
  "cta.title.1": { pt: "O futuro do seu código ", en: "The future of your code " },
  "cta.title.highlight": { pt: "começa agora.", en: "starts now." },
  "cta.subtitle": {
    pt: "Pare de adivinhar sua stack. Comece a construir com certeza e escala desde o dia zero.",
    en: "Stop guessing your stack. Start building with certainty and scale from day zero."
  },
  "cta.button": { pt: "Começar meu Projeto", en: "Start my Project" },

  // ══════════════════════════════════
  //  FOOTER
  // ══════════════════════════════════
  "footer.termos": { pt: "Termos de Uso", en: "Terms of Use" },
  "footer.privacidade": { pt: "Privacidade", en: "Privacy" },

  // ══════════════════════════════════
  //  AUTH / LOGIN / PERFIL
  // ══════════════════════════════════
  "auth.welcome": { pt: "Seja bem-vindo ao Futuro.", en: "Welcome to the Future." },
  "auth.subtitle": { pt: "Entre na sua conta para orquestrar sua próxima arquitetura.", en: "Sign in to orchestrate your next architecture." },
  "auth.tab.login": { pt: "Entrar", en: "Sign In" },
  "auth.tab.register": { pt: "Criar Conta", en: "Sign Up" },
  "auth.google": { pt: "Continuar com o Google", en: "Continue with Google" },
  "auth.or": { pt: "ou", en: "or" },
  "auth.email": { pt: "E-mail", en: "Email" },
  "auth.password": { pt: "Senha", en: "Password" },
  "auth.name": { pt: "Nome completo", en: "Full name" },
  "auth.forgot": { pt: "Esqueci minha senha", en: "Forgot password" },
  "auth.login.btn": { pt: "Entrar no Sistema", en: "Sign In" },
  "auth.register.btn": { pt: "Criar minha Conta", en: "Create Account" },
  "auth.no.account": { pt: "Não tem uma conta?", en: "Don't have an account?" },
  "auth.request": { pt: "Solicite Acesso", en: "Request Access" },
  "perfil.title": { pt: "Meu Perfil", en: "My Profile" },
  "perfil.dados": { pt: "Dados Pessoais", en: "Personal Info" },
  "perfil.prefs": { pt: "Preferências", en: "Preferences" },
  "perfil.nome": { pt: "Nome completo", en: "Full name" },
  "perfil.salvar": { pt: "Salvar Nome", en: "Save Name" },
  "perfil.senioridade": { pt: "Senioridade", en: "Seniority" },
  "perfil.tema": { pt: "Tema", en: "Theme" },
  "perfil.tema.escuro": { pt: "Escuro", en: "Dark" },
  "perfil.tema.claro": { pt: "Claro", en: "Light" },
  "perfil.sair": { pt: "Sair", en: "Sign Out" },
  "perfil.salvo": { pt: "Salvo com sucesso!", en: "Saved successfully!" },
  "perfil.idioma": { pt: "Idioma", en: "Language" },
  "perfil.idioma.tooltip": { pt: "Este idioma será usado na interface do sistema. O idioma do prompt gerado é configurado separadamente no wizard.", en: "This language will be used for the system interface. The generated prompt language is configured separately in the wizard." },
  "perfil.uso": { pt: "Uso", en: "Usage" },
  "perfil.uso.plano": { pt: "Plano Atual", en: "Current Plan" },
  "perfil.uso.creditos": { pt: "Créditos Utilizados", en: "Credits Used" },
  "perfil.uso.geracoes": { pt: "Gerações PRD", en: "PRD Generations" },
  "perfil.uso.chats": { pt: "Mensagens de Chat", en: "Chat Messages" },
  "perfil.uso.audios": { pt: "Áudios TTS", en: "TTS Audio" },
  "perfil.uso.grafico": { pt: "Uso por Modelo", en: "Usage by Model" },

  // ══════════════════════════════════
  //  BIBLIOTECA
  // ══════════════════════════════════
  "bib.title": { pt: "Biblioteca ", en: "Tech " },
  "bib.title.highlight": { pt: "Técnica", en: "Library" },
  "bib.subtitle": {
    pt: "Explore as ferramentas mais consolidadas do mercado e saiba exatamente quando usar.",
    en: "Explore the most established tools in the market and know exactly when to use them."
  },
  "bib.search": {
    pt: "Qual stack ou ferramenta você quer entender hoje?",
    en: "Which stack or tool do you want to understand today?"
  },
  "bib.tecnologias": { pt: "Tecnologias", en: "Technologies" },
  "bib.categorias": { pt: "Categorias", en: "Categories" },
  "bib.todas": { pt: "Todas as Stacks", en: "All Stacks" },
  "bib.acessar": { pt: "Acessar Sistema", en: "Access System" },
  "bib.analytics": { pt: "Visualizar Analytics", en: "View Analytics" },
  "bib.detail.title": { pt: "Visão Detalhada", en: "Detailed View" },
  "bib.detail.overview": { pt: "Visão Geral", en: "Overview" },
  "bib.detail.pros": { pt: "Vantagens Notáveis", en: "Notable Advantages" },
  "bib.detail.cons": { pt: "Fatores Críticos / Contras", en: "Critical Factors / Cons" },
  "bib.detail.ideal": { pt: "Cena Ideal", en: "Ideal Scenario" },
  "bib.detail.website": { pt: "Visitar Site Oficial", en: "Visit Official Website" },
  "bib.empty.title": { pt: "Nenhuma tecnologia encontrada", en: "No technology found" },
  "bib.empty.desc": { pt: "Tente buscar por um termo diferente ou mude a categoria.", en: "Try searching for a different term or change the category." },

  // ══════════════════════════════════
  //  ANALYTICS
  // ══════════════════════════════════
  "analytics.title": { pt: "Compare Stacks Modernas", en: "Compare Modern Stacks" },
  "analytics.inputA.placeholder": { pt: "Ex: Next.js", en: "E.g.: Next.js" },
  "analytics.inputB.placeholder": { pt: "Comparar com...", en: "Compare with..." },
  "analytics.stars": { pt: "Estrelas GitHub", en: "GitHub Stars" },
  "analytics.commits": { pt: "Vitalidade de Commits", en: "Commit Vitality" },
  "analytics.issues": { pt: "Issues Abertas", en: "Open Issues" },
  "analytics.forks": { pt: "Forks", en: "Forks" },
  "analytics.adoption": { pt: "Velocidade de Adoção", en: "Adoption Velocity" },
  "analytics.adoption.sub": { pt: "Atividade de commits comparativa por mês", en: "Comparative commit activity per month" },
  "analytics.performance": { pt: "Matriz de Performance", en: "Performance Matrix" },
  "analytics.performance.sub": { pt: "Análise dimensional de features", en: "Dimensional feature analysis" },
  "analytics.pulse": { pt: "Atividade de Pulso", en: "Pulse Activity" },
  "analytics.pulse.sub": { pt: "Intensidade de contribuição nas últimas 52 semanas", en: "Contribution intensity over the last 52 weeks" },
  "analytics.insight.badge": { pt: "Insight IA", en: "AI Insight" },
  "analytics.insight.title": { pt: "Análise Inteligente", en: "Smart Analysis" },
  "analytics.compare": { pt: "Comparar", en: "Compare" },
  "analytics.loading": { pt: "Buscando dados do GitHub...", en: "Fetching GitHub data..." },
  "analytics.error": { pt: "Erro ao buscar dados. Verifique os nomes dos repositórios.", en: "Error fetching data. Check repository names." },
  "analytics.less": { pt: "MENOS", en: "LESS" },
  "analytics.more": { pt: "MAIS", en: "MORE" },
  "analytics.confidence": { pt: "Confiança Geral", en: "Overall Confidence" },
  "analytics.lastPush": { pt: "Último push", en: "Last push" },
  "analytics.commitsMonth": { pt: "commits/mês", en: "commits/month" },

  // ══════════════════════════════════
  //  APP / WIZARD
  // ══════════════════════════════════
  "app.insights": { pt: "Architecture Insights", en: "Architecture Insights" },
  "app.custo": { pt: "Estimativa de Custo", en: "Cost Estimate" },
  "app.complexidade": { pt: "Complexidade", en: "Complexity" },
  "app.ttm": { pt: "Time-to-Market", en: "Time-to-Market" },
  "app.senioridade": { pt: "Senioridade", en: "Seniority" },
  "app.sugestao": { pt: "Sugestão Live", en: "Live Suggestion" },
  "app.sugestao.default": { pt: "Preencha o formulário para receber sugestões em tempo real.", en: "Fill in the form to receive real-time suggestions." },
  "app.engine": { pt: "AI Engine: Online & Analisando", en: "AI Engine: Online & Analyzing" },
  "app.voltar": { pt: "Voltar", en: "Back" },
  "app.proxima": { pt: "Próxima Etapa", en: "Next Step" },
  "app.gerar": { pt: "Gerar PRD & Prompt Base", en: "Generate PRD & Base Prompt" },
  "app.loading.title": { pt: "Construindo sua Arquitetura...", en: "Building your Architecture..." },
  "app.tab.prd": { pt: "PRD Estratégico", en: "Strategic PRD" },
  "app.tab.prompt": { pt: "Prompt Base", en: "Base Prompt" },
  "app.copiar": { pt: "COPIAR", en: "COPY" },
  "app.copiado": { pt: "COPIADO!", en: "COPIED!" },
  "app.personalizar": { pt: "Personalizar", en: "Customize" },
  "app.personalizar.placeholder": { pt: "Digite o nome da tecnologia que deseja usar...", en: "Type the technology name you want to use..." },
  "app.personalizar.confirmar": { pt: "Confirmar", en: "Confirm" },
  "app.personalizar.selecionado": { pt: "Selecionado!", en: "Selected!" },
  "app.opcional": { pt: "Opcional para projetos pessoais", en: "Optional for personal projects" },
  "app.search.empty": { pt: "Nenhuma tecnologia encontrada. Tente outro termo.", en: "No technology found. Try another term." },
  "app.esc": { pt: "ESC limpa", en: "ESC clears" },
  "app.testes.title": { pt: "Estratégia de Testes", en: "Testing Strategy" },
  "app.modal.overview": { pt: "Visão Geral", en: "Overview" },
  "app.modal.pros": { pt: "Vantagens", en: "Advantages" },
  "app.modal.cons": { pt: "Contras", en: "Cons" },
  "app.modal.ideal": { pt: "Cena Ideal", en: "Ideal Scenario" },
  "app.modal.website": { pt: "Acessar Site Oficial", en: "Visit Official Website" },

  // ══════════════════════════════════
  //  PREÇOS (Pricing Page)
  // ══════════════════════════════════
  "precos.hero.title.1": { pt: "Arquitete seu ", en: "Architect your " },
  "precos.hero.title.highlight": { pt: "Futuro", en: "Future" },
  "precos.hero.subtitle": {
    pt: "Software de precisão para o arquiteto técnico moderno. Escolha o plano que escala com sua ambição.",
    en: "Precision software for the modern technical architect. Choose the plan that scales with your ambition."
  },
  "precos.billing.monthly": { pt: "Mensal", en: "Monthly" },
  "precos.billing.yearly": { pt: "Anual", en: "Yearly" },
  "precos.billing.discount": { pt: "(-20%)", en: "(-20%)" },
  "precos.plan.explorer": { pt: "Explorador", en: "Explorer" },
  "precos.plan.explorer.tag": { pt: "Free", en: "Free" },
  "precos.plan.explorer.desc": {
    pt: "Perfeito para quem quer explorar o sistema e entender o poder da arquitetura assistida por IA.",
    en: "Perfect for those who want to explore the system and understand the power of AI-assisted architecture."
  },
  "precos.plan.explorer.cta": { pt: "Começar Grátis", en: "Start Free" },
  "precos.plan.explorer.f1": { pt: "Apenas agente", en: "Only agent" },
  "precos.plan.explorer.f2": { pt: "e Prompt Bases salvos", en: "and Prompt Bases saved" },
  "precos.plan.explorer.f3": { pt: "de IA gratuita", en: "of free AI" },
  "precos.plan.explorer.f4": { pt: "LLMs médias e premium bloqueadas", en: "Medium and premium LLMs locked" },
  "precos.plan.explorer.f5": { pt: "Prompt Base até", en: "Prompt Base up to" },
  "precos.plan.explorer.f6": { pt: "Sem resumo em áudio", en: "No audio summary" },
  "precos.plan.pro": { pt: "Consultor", en: "Consultant" },
  "precos.plan.pro.tag": { pt: "Pro", en: "Pro" },
  "precos.plan.pro.desc": {
    pt: "Ideal para desenvolvedores em crescimento e consultores freelance que precisam de mais poder.",
    en: "Ideal for growing developers and freelance consultants who need more power."
  },
  "precos.plan.pro.cta": { pt: "Upgrade para Pro", en: "Upgrade to Pro" },
  "precos.plan.pro.f1": { pt: "liberados", en: "unlocked" },
  "precos.plan.pro.f2": { pt: "e Prompt Bases salvos", en: "and Prompt Bases saved" },
  "precos.plan.pro.f3": { pt: "ilimitadas", en: "unlimited" },
  "precos.plan.pro.f4": { pt: "em LLMs premium", en: "on premium LLMs" },
  "precos.plan.pro.f5": { pt: "Prompt Base até", en: "Prompt Base up to" },
  "precos.plan.pro.f6": { pt: "Importação em", en: "Import in" },
  "precos.plan.pro.f7": { pt: "da IA", en: "from AI" },
  "precos.plan.elite": { pt: "Arquiteto", en: "Architect" },
  "precos.plan.elite.tag": { pt: "Elite", en: "Elite" },
  "precos.plan.elite.badge": { pt: "Elite Choice", en: "Elite Choice" },
  "precos.plan.elite.desc": {
    pt: "O kit definitivo — poder absoluto para arquitetos que exigem o máximo do sistema.",
    en: "The ultimate kit — absolute power for architects who demand the most from the system."
  },
  "precos.plan.elite.cta": { pt: "Começar Agora", en: "Start Now" },
  "precos.plan.elite.f1": { pt: "liberados", en: "unlocked" },
  "precos.plan.elite.f2": { pt: "ilimitados", en: "unlimited" },
  "precos.plan.elite.f3": { pt: "ilimitadas", en: "unlimited" },
  "precos.plan.elite.f4": { pt: "em LLMs premium", en: "on premium LLMs" },
  "precos.plan.elite.f5": { pt: "Prompt Base até", en: "Prompt Base up to" },
  "precos.plan.elite.f6": { pt: "e mais", en: "and more" },
  "precos.plan.elite.f7": { pt: "da IA", en: "from AI" },
  "precos.plan.elite.f8": { pt: "mais inteligentes", en: "smarter" },
  "precos.plan.elite.f9": { pt: "mais detalhados", en: "more detailed" },
  "precos.agents.all": { pt: "Todos os agentes", en: "All agents" },
  "precos.audio": { pt: "Resumo em", en: "Summary in" },
  "precos.audio.word": { pt: "áudio", en: "audio" },
  "precos.responses": { pt: "Respostas", en: "Responses" },
  "precos.promptbases": { pt: "Prompt Bases", en: "Prompt Bases" },
  "precos.why.title.1": { pt: "Por que ", en: "Why " },
  "precos.why.title.2": { pt: "BuildCode", en: "BuildCode" },
  "precos.why.title.3": { pt: "?", en: "?" },
  "precos.why.precision.title": { pt: "Precisão Sistêmica", en: "Systemic Precision" },
  "precos.why.precision.desc": {
    pt: "Arquiteturas modeladas com teoria dos grafos e padrões comprovados. Cada conexão, cada dependência é mapeada com precisão matemática para garantir integridade estrutural do seu sistema.",
    en: "Architectures modeled with graph theory and proven patterns. Every connection, every dependency is mapped with mathematical precision to ensure structural integrity of your system."
  },
  "precos.why.speed.title": { pt: "Workflow Relâmpago", en: "Lightning Workflow" },
  "precos.why.speed.desc": { pt: "Prototipe e valide arquiteturas em minutos, não semanas.", en: "Prototype and validate architectures in minutes, not weeks." },
  "precos.why.security.title": { pt: "Seguro & Protegido", en: "Secure & Protected" },
  "precos.why.security.desc": { pt: "Criptografia de ponta a ponta em todos os seus projetos.", en: "End-to-end encryption on all your projects." },
  "precos.why.ai.title": { pt: "Pronto para IA", en: "AI Ready" },
  "precos.why.ai.desc": {
    pt: "Inteligência artificial integrada que sugere padrões, detecta anti-patterns e otimiza sua arquitetura automaticamente.",
    en: "Integrated artificial intelligence that suggests patterns, detects anti-patterns, and optimizes your architecture automatically."
  },
  "precos.faq.title": { pt: "Perguntas Frequentes", en: "Frequently Asked Questions" },
  "precos.faq.q1": { pt: "Posso trocar de plano depois?", en: "Can I change plans later?" },
  "precos.faq.a1": {
    pt: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. A cobrança é ajustada proporcionalmente no próximo ciclo de faturamento.",
    en: "Yes, you can upgrade or downgrade at any time. Billing is adjusted proportionally in the next billing cycle."
  },
  "precos.faq.q2": { pt: "Vocês oferecem desconto educacional?", en: "Do you offer educational discounts?" },
  "precos.faq.a2": {
    pt: "Sim, oferecemos 50% de desconto no plano Consultor para estudantes e educadores com e-mail institucional válido (.edu ou equivalente).",
    en: "Yes, we offer 50% off the Consultant plan for students and educators with a valid institutional email (.edu or equivalent)."
  },
  "precos.faq.q3": { pt: "Meus dados são criptografados?", en: "Is my data encrypted?" },
  "precos.faq.a3": {
    pt: "Absolutamente. Utilizamos criptografia AES-256 para dados em repouso e TLS 1.3 para dados em trânsito, garantindo segurança de nível enterprise.",
    en: "Absolutely. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit, ensuring enterprise-level security."
  },
  "precos.footer.rights": { pt: "Todos os direitos reservados.", en: "All rights reserved." },

  // ══════════════════════════════════
  //  ADMIN DASHBOARD
  // ══════════════════════════════════
  "admin.badge": { pt: "Admin Dashboard", en: "Admin Dashboard" },
  "admin.back": { pt: "Voltar ao Perfil", en: "Back to Profile" },
  "admin.loading": { pt: "Carregando dashboard...", en: "Loading dashboard..." },
  "admin.unauth.title": { pt: "Acesso Restrito", en: "Restricted Access" },
  "admin.unauth.desc": { pt: "Apenas administradores podem acessar esta página.", en: "Only administrators can access this page." },
  "admin.unauth.back": { pt: "Voltar ao Perfil", en: "Back to Profile" },

  // ══════════════════════════════════
  //  PERFIL (additional)
  // ══════════════════════════════════
  "perfil.loading": { pt: "Carregando perfil...", en: "Loading profile..." },
  "perfil.unauth.title": { pt: "Acesso necessário", en: "Access required" },
  "perfil.unauth.desc": { pt: "Faça login para acessar seu perfil.", en: "Sign in to access your profile." },
  "perfil.unauth.login": { pt: "Fazer Login", en: "Sign In" },
  "perfil.agente": { pt: "Agente", en: "Agent" },
  "perfil.llm": { pt: "Modelo de LLM", en: "LLM Model" },
  "perfil.admin.title": { pt: "Dashboard Admin", en: "Admin Dashboard" },
  "perfil.admin.desc": { pt: "Acessar painel administrativo completo", en: "Access full admin panel" },
  "perfil.admin.btn": { pt: "Abrir Dashboard", en: "Open Dashboard" },
  "perfil.gestao": { pt: "Gestão de Usuários", en: "User Management" },
  "perfil.gestao.nome": { pt: "Nome", en: "Name" },
  "perfil.gestao.id": { pt: "ID", en: "ID" },
  "perfil.gestao.cargo": { pt: "Cargo", en: "Role" },
  "perfil.gestao.senior": { pt: "Senioridade", en: "Seniority" },
  "perfil.gestao.acoes": { pt: "Ações", en: "Actions" },
};
