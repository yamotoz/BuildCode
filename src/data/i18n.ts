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
  //  LANDING PAGE — HERO
  // ══════════════════════════════════
  "lp.hero.badge": { pt: "IA-Powered Architecture", en: "AI-Powered Architecture" },
  "lp.hero.title.1": { pt: "Nunca mais construa", en: "Never build" },
  "lp.hero.title.2": { pt: "software ", en: "software " },
  "lp.hero.title.highlight": { pt: "no escuro.", en: "in the dark." },
  "lp.hero.subtitle": {
    pt: "O BuildCode analisa seus requisitos, seleciona a stack ideal e gera documentação profissional completa. Tudo guiado por inteligência artificial em menos de 3 minutos.",
    en: "BuildCode analyzes your requirements, selects the ideal stack and generates complete professional documentation. All guided by artificial intelligence in less than 3 minutes."
  },
  "lp.hero.cta.primary": { pt: "Criar Meu Projeto Agora", en: "Create My Project Now" },
  "lp.hero.cta.secondary": { pt: "Entender o Problema", en: "Understand the Problem" },
  "lp.hero.proof.lgpd": { pt: "LGPD Compliant", en: "LGPD Compliant" },
  "lp.hero.proof.agents": { pt: "4 Agentes de IA", en: "4 AI Agents" },
  "lp.hero.proof.docs": { pt: "PRD + Prompt Base", en: "PRD + Base Prompt" },

  // ══════════════════════════════════
  //  LANDING PAGE — PROBLEMA (Section 2)
  // ══════════════════════════════════
  "lp.problema.badge": { pt: "Alerta Crítico", en: "Critical Alert" },
  "lp.problema.title.1": { pt: "Seu software é um alvo.", en: "Your software is a target." },
  "lp.problema.title.highlight": { pt: "Você só não sabe ainda.", en: "You just don't know it yet." },
  "lp.problema.subtitle": {
    pt: "A cada 39 segundos, um ataque cibernético acontece no mundo. E a maioria das vítimas tinha \"certeza\" de que estava protegida. O problema não é a falta de ferramentas. É a falta de planejamento desde o dia zero.",
    en: "Every 39 seconds, a cyberattack happens worldwide. And most victims were \"sure\" they were protected. The problem isn't the lack of tools. It's the lack of planning from day zero."
  },
  "lp.problema.card1.title": { pt: "Falhas de Segurança Silenciosas", en: "Silent Security Flaws" },
  "lp.problema.card1.desc": {
    pt: "SQL Injection, XSS, CSRF. Vulnerabilidades que dormem no seu código até alguém explorá-las. Sem uma arquitetura segura desde o início, cada feature nova é uma porta aberta para invasores.",
    en: "SQL Injection, XSS, CSRF. Vulnerabilities sleeping in your code until someone exploits them. Without a secure architecture from the start, every new feature is an open door for attackers."
  },
  "lp.problema.card1.stat": { pt: "78% das brechas vêm de código mal arquitetado", en: "78% of breaches come from poorly architected code" },
  "lp.problema.card2.title": { pt: "Projetos Sem Gestão Real", en: "Projects Without Real Management" },
  "lp.problema.card2.desc": {
    pt: "Sem documentação, sem roadmap técnico, sem PRD. O time avança no escuro, cada dev puxa pra um lado, e o projeto se torna um labirinto que ninguém entende. Nem quem criou.",
    en: "No documentation, no technical roadmap, no PRD. The team moves in the dark, each dev pulls in a different direction, and the project becomes a maze nobody understands. Not even its creator."
  },
  "lp.problema.card2.stat": { pt: "67% dos projetos falham por gestão deficiente", en: "67% of projects fail due to poor management" },
  "lp.problema.card3.title": { pt: "Dívida Técnica Explosiva", en: "Explosive Technical Debt" },
  "lp.problema.card3.desc": {
    pt: "Escolher a stack errada é plantar uma bomba-relógio. Quando o produto precisa escalar, o custo de refatoração não é técnico. É existencial. Startups morrem por isso todos os dias.",
    en: "Choosing the wrong stack is planting a time bomb. When the product needs to scale, the refactoring cost isn't technical. It's existential. Startups die from this every day."
  },
  "lp.problema.card3.stat": { pt: "Refatorar custa 10x mais que planejar", en: "Refactoring costs 10x more than planning" },

  // ══════════════════════════════════
  //  LANDING PAGE — REALIDADE (Section 3)
  // ══════════════════════════════════
  "lp.realidade.badge": { pt: "Realidade do Mercado", en: "Market Reality" },
  "lp.realidade.title.1": { pt: "Saber usar IA pra gerar código", en: "Knowing how to use AI to generate code" },
  "lp.realidade.title.highlight": { pt: "não te faz engenheiro.", en: "doesn't make you an engineer." },
  "lp.realidade.subtitle": {
    pt: "O mercado está inundado de \"devs\" que copiam e colam código de ChatGPT sem entender o que está por trás. Chamam isso de \"vibe coding\" e consideram isso programação. Enquanto isso, os sistemas que eles criam são bombas-relógio de segurança esperando pra explodir.",
    en: "The market is flooded with \"devs\" who copy and paste ChatGPT code without understanding what's behind it. They call it \"vibe coding\" and consider it programming. Meanwhile, the systems they create are security time bombs waiting to explode."
  },
  "lp.realidade.item1.title": { pt: "Código sem contexto de segurança", en: "Code without security context" },
  "lp.realidade.item1.desc": {
    pt: "Uma API sem rate limiting, um form sem sanitização, um JWT sem expiração. Erros que uma IA gera em 2 segundos e que um hacker explora em menos.",
    en: "An API without rate limiting, a form without sanitization, a JWT without expiration. Errors an AI generates in 2 seconds and a hacker exploits in less."
  },
  "lp.realidade.item2.title": { pt: "Arquiteturas que não sobrevivem à escala", en: "Architectures that don't survive scaling" },
  "lp.realidade.item2.desc": {
    pt: "Monolitos acoplados, banco de dados sem indexação, zero caching. Funciona com 10 usuários. Com 10.000, colapsa.",
    en: "Coupled monoliths, databases without indexing, zero caching. Works with 10 users. With 10,000, it collapses."
  },
  "lp.realidade.item3.title": { pt: "Falsa confiança, prejuízo real", en: "False confidence, real losses" },
  "lp.realidade.item3.desc": {
    pt: "\"Tá funcionando\" não significa \"tá seguro\". A diferença entre um software amador e um profissional está no que acontece quando as coisas dão errado.",
    en: "\"It's working\" doesn't mean \"it's secure\". The difference between amateur and professional software is what happens when things go wrong."
  },

  // ══════════════════════════════════
  //  LANDING PAGE — POR QUE (Section 4)
  // ══════════════════════════════════
  "lp.porque.badge": { pt: "Por Que BuildCode", en: "Why BuildCode" },
  "lp.porque.title.1": { pt: "Construa software como um", en: "Build software like a" },
  "lp.porque.title.highlight": { pt: "arquiteto sênior.", en: "senior architect." },
  "lp.porque.subtitle": {
    pt: "Mesmo que você esteja começando. O BuildCode coloca décadas de experiência em engenharia nas suas mãos, em forma de inteligência artificial que pensa antes de agir.",
    en: "Even if you're just starting out. BuildCode puts decades of engineering experience in your hands, in the form of artificial intelligence that thinks before it acts."
  },
  "lp.porque.f1.title": { pt: "Simplicidade Radical", en: "Radical Simplicity" },
  "lp.porque.f1.desc": {
    pt: "Responda um questionário inteligente de 20 etapas. A IA faz o resto: seleciona a stack, gera o PRD, cria o Prompt Base e entrega tudo documentado. Zero complexidade pra você.",
    en: "Answer a smart 20-step questionnaire. AI does the rest: selects the stack, generates the PRD, creates the Base Prompt and delivers everything documented. Zero complexity for you."
  },
  "lp.porque.f2.title": { pt: "Segurança Desde o Dia Zero", en: "Security From Day Zero" },
  "lp.porque.f2.desc": {
    pt: "Cada recomendação do BuildCode já considera OWASP Top 10, sanitização de inputs, rate limiting, autenticação robusta e boas práticas de infraestrutura. Segurança não é extra. É o padrão.",
    en: "Every BuildCode recommendation already considers OWASP Top 10, input sanitization, rate limiting, robust authentication and infrastructure best practices. Security isn't extra. It's the standard."
  },
  "lp.porque.f3.title": { pt: "IA Disponível 24/7", en: "AI Available 24/7" },
  "lp.porque.f3.desc": {
    pt: "Dúvidas sobre sua stack? Quer entender por que o sistema recomendou PostgreSQL em vez de MongoDB? Pergunte ao chat integrado. A IA responde com contexto do seu projeto, não com respostas genéricas.",
    en: "Questions about your stack? Want to understand why the system recommended PostgreSQL instead of MongoDB? Ask the integrated chat. AI responds with your project's context, not generic answers."
  },
  "lp.porque.f4.title": { pt: "Organização de Verdade", en: "Real Organization" },
  "lp.porque.f4.desc": {
    pt: "PRD profissional, Prompt Base otimizado, insights de complexidade, gráficos de stack e projetos salvos no seu perfil. Tudo que um gestor de projetos precisa, automatizado e em português.",
    en: "Professional PRD, optimized Base Prompt, complexity insights, stack charts and saved projects in your profile. Everything a project manager needs, automated and ready to go."
  },
  "lp.porque.cta": { pt: "Experimentar Gratuitamente", en: "Try It Free" },

  // ══════════════════════════════════
  //  LANDING PAGE — DIFERENCIAIS (Section 5)
  // ══════════════════════════════════
  "lp.diff.badge": { pt: "Diferenciais", en: "Differentials" },
  "lp.diff.title.1": { pt: "O que torna o BuildCode", en: "What makes BuildCode" },
  "lp.diff.title.highlight": { pt: "insubstituível.", en: "irreplaceable." },
  "lp.diff.f1.title": { pt: "4 Agentes de IA Especializados", en: "4 Specialized AI Agents" },
  "lp.diff.f1.desc": {
    pt: "Cada agente tem personalidade, visão técnica e abordagem única. Escolha quem vai guiar seu projeto: do pragmático ao visionário, do especialista em segurança à rainha do fullstack.",
    en: "Each agent has personality, technical vision and a unique approach. Choose who will guide your project: from the pragmatic to the visionary, from the security specialist to the fullstack queen."
  },
  "lp.diff.f2.title": { pt: "Gráficos de Stack Interativos", en: "Interactive Stack Charts" },
  "lp.diff.f2.desc": {
    pt: "Ao final do questionário, visualize sua arquitetura em gráficos detalhados: distribuição de tecnologias, complexidade por camada, custo estimado e score de segurança. Dados, não achismos.",
    en: "At the end of the questionnaire, visualize your architecture in detailed charts: technology distribution, complexity per layer, estimated cost and security score. Data, not guesswork."
  },
  "lp.diff.f3.title": { pt: "PRD + Prompt Base Profissional", en: "PRD + Professional Base Prompt" },
  "lp.diff.f3.desc": {
    pt: "Documentação completa gerada automaticamente: PRD com justificativa de cada tecnologia, estimativa de custo e arquitetura visual. Prompt Base otimizado com boas práticas de código, responsividade e clean code.",
    en: "Complete documentation generated automatically: PRD with justification for each technology, cost estimation and visual architecture. Optimized Base Prompt with code best practices, responsiveness and clean code."
  },
  "lp.diff.mini1.title": { pt: "Multi-idioma", en: "Multi-language" },
  "lp.diff.mini1.sub": { pt: "PT-BR & English", en: "PT-BR & English" },
  "lp.diff.mini2.title": { pt: "Biblioteca 200+", en: "Library 200+" },
  "lp.diff.mini2.sub": { pt: "Ferramentas curadas", en: "Curated tools" },
  "lp.diff.mini3.title": { pt: "Tema Dark/Light", en: "Dark/Light Theme" },
  "lp.diff.mini3.sub": { pt: "Interface adaptável", en: "Adaptive interface" },
  "lp.diff.mini4.title": { pt: "GitHub Analytics", en: "GitHub Analytics" },
  "lp.diff.mini4.sub": { pt: "Compare tecnologias", en: "Compare technologies" },

  // ══════════════════════════════════
  //  LANDING PAGE — SOLUÇÃO / AGENTES (Section 6)
  // ══════════════════════════════════
  "lp.solucao.badge": { pt: "A Solução", en: "The Solution" },
  "lp.solucao.title.1": { pt: "Quatro mentes artificiais.", en: "Four artificial minds." },
  "lp.solucao.title.highlight": { pt: "Uma missão: proteger seu software.", en: "One mission: protect your software." },
  "lp.solucao.subtitle": {
    pt: "O BuildCode não é só uma ferramenta. É uma equipe de especialistas com inteligência artificial que analisa, questiona e valida cada decisão do seu projeto. Conheça os agentes que vão blindar sua arquitetura.",
    en: "BuildCode isn't just a tool. It's a team of AI-powered specialists that analyzes, questions and validates every decision in your project. Meet the agents that will armor your architecture."
  },
  "lp.agent.boss.role": { pt: "O Arquiteto Pragmático", en: "The Pragmatic Architect" },
  "lp.agent.boss.quote": {
    pt: "\"Você quer um software ou um brinquedo? Se for pra usar essa stack lenta, nem me faça perder tempo.\"",
    en: "\"Do you want software or a toy? If you're going to use that slow stack, don't waste my time.\""
  },
  "lp.agent.boss.desc": {
    pt: "Direto, brutal e sem filtro. The Boss exige performance, escalabilidade e decisões técnicas que sobrevivam ao teste do tempo. API com mais de 200ms? Prepare-se pra ouvir.",
    en: "Direct, brutal and unfiltered. The Boss demands performance, scalability and technical decisions that survive the test of time. API over 200ms? Prepare to hear about it."
  },
  "lp.agent.azrael.role": { pt: "O Visionário Obsessivo", en: "The Obsessive Visionary" },
  "lp.agent.azrael.quote": {
    pt: "\"Isso é funcional, mas não é revolucionário. Por que não adicionamos uma camada de análise preditiva aqui?\"",
    en: "\"This is functional, but not revolutionary. Why don't we add a predictive analysis layer here?\""
  },
  "lp.agent.azrael.desc": {
    pt: "Pensa três passos à frente. Azrael vê seu MVP como trampolim, não como destino. Se existe uma forma de integrar IA, dados preditivos ou automação, ele vai encontrar.",
    en: "Thinks three steps ahead. Azrael sees your MVP as a springboard, not a destination. If there's a way to integrate AI, predictive data or automation, he will find it."
  },
  "lp.agent.rizler.role": { pt: "O Fantasma do Red Team", en: "The Red Team Ghost" },
  "lp.agent.rizler.quote": {
    pt: "\"Bonito seu front-end. Uma pena que eu levaria 12 segundos para derrubar sua DB com um SQL Injection básico nesse setup.\"",
    en: "\"Nice front-end. Too bad it would take me 12 seconds to drop your DB with a basic SQL Injection on this setup.\""
  },
  "lp.agent.rizler.desc": {
    pt: "Paranoico por natureza, brilhante por mérito. Rizler pensa como um hacker pra proteger como um engenheiro. Portas abertas, .env exposto, MFA ausente. Nada escapa.",
    en: "Paranoid by nature, brilliant by merit. Rizler thinks like a hacker to protect like an engineer. Open ports, exposed .env, missing MFA. Nothing escapes."
  },
  "lp.agent.anastasia.role": { pt: "A Rainha do Fullstack", en: "The Fullstack Queen" },
  "lp.agent.anastasia.quote": {
    pt: "\"Calma, baby. Vamos escolher uma stack que deixe seu backend tão atraente quanto o seu front.\"",
    en: "\"Easy, baby. Let's pick a stack that makes your backend as attractive as your front.\""
  },
  "lp.agent.anastasia.desc": {
    pt: "Técnica, confiante e elegante. Anastasia garante que frontend e backend conversem em harmonia. Design system primeiro, TypeScript obrigatório, componentes enxutos. Padrão de rainha.",
    en: "Technical, confident and elegant. Anastasia ensures frontend and backend talk in harmony. Design system first, TypeScript mandatory, lean components. Queen's standard."
  },
  "lp.solucao.mentor": { pt: "Escolha seu mentor. Construa com confiança.", en: "Choose your mentor. Build with confidence." },
  "lp.solucao.cta": { pt: "Escolher Meu Agente", en: "Choose My Agent" },

  // ══════════════════════════════════
  //  LANDING PAGE — CYBERDYNE (Section 7)
  // ══════════════════════════════════
  "lp.cyber.badge": { pt: "Em Desenvolvimento", en: "In Development" },
  "lp.cyber.tagline": { pt: "Encontre as falhas antes que elas encontrem você.", en: "Find the flaws before they find you." },
  "lp.cyber.desc": {
    pt: "Cyberdyne é um script de segurança ofensiva projetado para varrer, identificar e documentar vulnerabilidades em aplicações web e sistemas locais. Ele não pergunta permissão. Ele testa tudo. XSS, SQL Injection, LFI, IDOR, SSRF, DDoS surface, e muito mais.",
    en: "Cyberdyne is an offensive security script designed to scan, identify and document vulnerabilities in web applications and local systems. It doesn't ask permission. It tests everything. XSS, SQL Injection, LFI, IDOR, SSRF, DDoS surface, and much more."
  },

  // ══════════════════════════════════
  //  LANDING PAGE — SERENITY (Section 8)
  // ══════════════════════════════════
  "lp.serenity.badge": { pt: "Em Desenvolvimento", en: "In Development" },
  "lp.serenity.tagline": { pt: "Qualidade não se discute. Se comprova.", en: "Quality isn't debated. It's proven." },
  "lp.serenity.desc": {
    pt: "Serenity é um motor de QA automatizado que testa cada funcionalidade do seu sistema com a precisão de um relojoeiro suíço. Integrado com IA, ele não só encontra falhas. Ele explica o porquê, sugere correções e gera um relatório executivo completo.",
    en: "Serenity is an automated QA engine that tests every feature of your system with the precision of a Swiss watchmaker. Integrated with AI, it doesn't just find flaws. It explains why, suggests fixes and generates a complete executive report."
  },
  "lp.serenity.e2e": { pt: "Testes E2E", en: "E2E Tests" },
  "lp.serenity.a11y": { pt: "Acessibilidade", en: "Accessibility" },
  "lp.serenity.report": { pt: "Relatório com IA", en: "AI Report" },
  "lp.serenity.responsive": { pt: "Responsividade", en: "Responsiveness" },
  "lp.serenity.functionality": { pt: "Funcionalidade", en: "Functionality" },
  "lp.serenity.accessibility": { pt: "Acessibilidade", en: "Accessibility" },
  "lp.serenity.responsiveness": { pt: "Responsividade", en: "Responsiveness" },

  // ══════════════════════════════════
  //  LANDING PAGE — CTA FINAL (Section 9)
  // ══════════════════════════════════
  "lp.cta.title.1": { pt: "O código que você escreve hoje", en: "The code you write today" },
  "lp.cta.title.2": { pt: "define o software de ", en: "defines the software of " },
  "lp.cta.title.highlight": { pt: "amanhã.", en: "tomorrow." },
  "lp.cta.subtitle": {
    pt: "Pare de improvisar. Pare de adivinhar. Comece cada projeto com a clareza, a segurança e a inteligência que ele merece.",
    en: "Stop improvising. Stop guessing. Start every project with the clarity, security and intelligence it deserves."
  },
  "lp.cta.button": { pt: "Criar Meu Projeto Agora", en: "Create My Project Now" },
  "lp.cta.subtext": { pt: "Gratuito. Sem cartão de crédito. Sem pegadinha.", en: "Free. No credit card. No catch." },

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
