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
  "nav.problema": { pt: "Problema", en: "Problem" },
  "nav.solucao": { pt: "Solução", en: "Solution" },
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
};
