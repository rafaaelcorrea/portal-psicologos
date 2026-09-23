/* ClaraMente
 * Frontend sem framework: estado, renderização e eventos ficam neste arquivo.
 */

const SEED_PROFESSIONALS = [
  {
    id: 'ana-luiza',
    name: 'Ana Luiza Martins',
    crm: '06/184.921',
    bio: 'Acompanho pessoas adultas em momentos de mudança, ansiedade e reconstrução da autoestima.',
    specialties: ['Ansiedade', 'Autoconhecimento'],
    whatsapp: '5511987654321',
    location: 'São Paulo, SP',
    modality: 'Online e presencial',
    initials: 'AL',
  },
  {
    id: 'caio-nogueira',
    name: 'Caio Nogueira',
    crm: '06/152.480',
    bio: 'Um espaço sem pressa para compreender padrões, vínculos e escolhas com mais gentileza.',
    specialties: ['Relacionamentos', 'Depressão'],
    whatsapp: '5521982345678',
    location: 'Rio de Janeiro, RJ',
    modality: 'Online',
    initials: 'CN',
  },
  {
    id: 'marina-valente',
    name: 'Marina Valente',
    crm: '06/198.703',
    bio: 'Trabalho com trauma e processos de luto, respeitando o ritmo e a história de cada pessoa.',
    specialties: ['Trauma', 'Ansiedade'],
    whatsapp: '5531987651020',
    location: 'Belo Horizonte, MG',
    modality: 'Online e presencial',
    initials: 'MV',
  },
  {
    id: 'rafael-azevedo',
    name: 'Rafael Azevedo',
    crm: '06/174.336',
    bio: 'Psicoterapia para quem deseja olhar para o uso de substâncias e retomar planos possíveis.',
    specialties: ['Vícios', 'Autoconhecimento'],
    whatsapp: '5548988112233',
    location: 'Florianópolis, SC',
    modality: 'Online',
    initials: 'RA',
  },
];

const SPECIALTIES = [
  'Todas',
  'Ansiedade',
  'Depressão',
  'Vícios',
  'Trauma',
  'Autoconhecimento',
  'Relacionamentos',
];

const WHATSAPP_MESSAGE =
  'Olá, encontrei seu perfil na ClaraMente e gostaria de saber mais sobre o atendimento.';

const DEFAULT_FORM = {
  name: '',
  crm: '',
  bio: '',
  specialties: '',
  whatsapp: '',
  location: '',
  modality: 'Online',
  initials: '',
};

const state = {
  professionals: [],
  loading: true,
  error: '',
  demoMode: false,
  search: '',
  specialty: 'Todas',
  menuOpen: false,
  identityConfigured: false,
  user: null,
  adminProfessionals: [],
  adminLoading: false,
  adminLoaded: false,
  adminDenied: false,
  formOpen: false,
  form: { ...DEFAULT_FORM },
  notice: '',
  adminError: '',
};

const app = document.querySelector('#app');
const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);

const ICONS = {
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  circleHelp: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.7-1.7 1.1-1.7 2.7M12 17h.01"/>',
  heart: '<path d="M20.8 8.6c0 5.4-8.8 10.2-8.8 10.2S3.2 14 3.2 8.6A4.4 4.4 0 0 1 12 6.3a4.4 4.4 0 0 1 8.8 2.3Z"/>',
  login: '<path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"/>',
  location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  message: '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.4 8.4 0 0 1-3.2-.7L4 20l1.7-3.8A7.4 7.4 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  sparkles: '<path d="m12 3-1.3 4.7L6 9l4.7 1.3L12 15l1.3-4.7L18 9l-4.7-1.3L12 3ZM5 16l-.6 2.4L2 19l2.4.6L5 22l.6-2.4L8 19l-2.4-.6L5 16Z"/>',
  stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4M16 13a4 4 0 1 0 4 4v-1M16 13h2"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  user: '<circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
};

function icon(name, size = 16) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function logo(dark = false) {
  return `<a class="logo ${dark ? 'logo--dark' : ''} focus-ring" href="/" data-action="go-home">
    <span class="logo-mark" aria-hidden="true"></span>
    <span class="logo-name">ClaraMente</span>
  </a>`;
}

function button(label, action, className = 'button-primary', iconName = '') {
  return `<button class="${className} focus-ring" type="button" data-action="${action}">
    ${iconName ? icon(iconName, 17) : ''}${label}
  </button>`;
}

function publicHeader() {
  const links = [
    ['#sobre', 'Sobre', 'link-sobre'],
    ['#profissionais', 'Profissionais', 'link-profissionais'],
    ['#contato', 'Contato', 'link-contato'],
  ];

  return `<header class="site-header">
    <div class="container site-header__inner">
      ${logo()}
      <nav class="desktop-nav" aria-label="Navegação principal">
        ${links.map(([href, label, testId]) => `<a class="nav-link focus-ring" href="${href}" data-testid="${testId}">${label}</a>`).join('')}
        <a class="button-quiet focus-ring" href="/admin" data-testid="link-admin">Área do portal</a>
      </nav>
      <button class="menu-button focus-ring" type="button" aria-label="${state.menuOpen ? 'Fechar menu' : 'Abrir menu'}" aria-expanded="${state.menuOpen}" data-action="toggle-menu">
        ${icon(state.menuOpen ? 'x' : 'menu', 22)}
      </button>
    </div>
    ${state.menuOpen ? `<div class="container">
      <nav class="mobile-nav animate-rise" aria-label="Menu móvel">
        ${links.map(([href, label, testId]) => `<a href="${href}" data-action="close-menu" data-testid="mobile-${testId}">${label}</a>`).join('')}
        <a class="button-primary" href="/admin" data-action="close-menu" data-testid="mobile-link-admin">Área do portal</a>
      </nav>
    </div>` : ''}
  </header>`;
}

function hero() {
  return `<section class="hero">
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="eyebrow animate-rise">Um começo mais leve</p>
        <h1 class="animate-rise">Encontrar cuidado também é <em>cuidar de si.</em></h1>
        <p class="hero__intro animate-rise">Um diretório feito para aproximar você de psicólogos que trabalham com escuta, ética e presença. No seu tempo.</p>
        <div class="hero__actions animate-rise">
          <a class="button-primary focus-ring" href="#profissionais" data-testid="button-encontrar-profissional">Encontrar um profissional ${icon('arrowRight', 17)}</a>
          <a class="button-quiet focus-ring" href="#sobre" data-testid="button-conhecer-claramemente">Conheça a ClaraMente ${icon('chevronDown', 16)}</a>
        </div>
        <div class="hero__avatars">
          <span class="avatar-stack">
            <span class="avatar-stack__item avatar-stack__item--teal">AL</span><span class="avatar-stack__item avatar-stack__item--coral">CN</span><span class="avatar-stack__item avatar-stack__item--blue">MV</span>
          </span>
          <span>Profissionais selecionados<br><strong>para escutar de verdade</strong></span>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-art__shape animate-float">
          <span class="hero-art__circle hero-art__circle--large"></span>
          <span class="hero-art__circle hero-art__circle--small"></span>
          <span class="hero-art__dot"></span>
          <span class="hero-art__quote">“ Todo caminho começa quando podemos falar.</span>
          <span class="hero-art__heart">${icon('heart', 23)}</span>
        </div>
        <div class="privacy-card">
          <div class="privacy-card__label">${icon('shield', 15)} Privacidade primeiro</div>
          <p>Você escolhe com quem e quando conversar.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function about() {
  const steps = [
    ['01', 'Escolha com calma', 'Filtre por aquilo que você está vivendo e conheça perfis reais.'],
    ['02', 'Converse diretamente', 'O primeiro contato acontece pelo WhatsApp, sem formulários intermináveis.'],
    ['03', 'Comece no seu ritmo', 'Não existe a escolha perfeita. Existe a escolha que parece possível hoje.'],
  ];

  return `<section id="sobre" class="section about">
    <div class="container about__grid">
      <div>
        <p class="section-label">Sobre a ClaraMente</p>
        <h2 class="section-heading">Cuidado não é pressa. É presença.</h2>
      </div>
      <div class="about__body">
        <p class="about__description">A ClaraMente nasceu para tornar o primeiro passo menos solitário. Reunimos profissionais com diferentes experiências para que você encontre uma escuta que faça sentido para a sua história.</p>
        <div class="steps">
          ${steps.map(([number, title, body]) => `<div class="step">
            <span class="step__number">${number}</span>
            <div><h3>${title}</h3><p>${body}</p></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function contact() {
  return `<section id="contato" class="section contact">
    <div class="container contact__grid">
      <div>
        <p class="section-label">Precisa de ajuda para começar?</p>
        <h2>Uma conversa pode mudar o jeito de atravessar o dia.</h2>
        <p class="contact__intro">Se você não souber por onde começar, tudo bem. Escreva para a nossa equipe e ajudamos você a encontrar um caminho.</p>
      </div>
      <div class="contact-card">
        <div class="contact-card__icon">${icon('circleHelp', 22)}</div>
        <h3>Fale com a ClaraMente</h3>
        <p>Respondemos de segunda a sexta, das 9h às 18h.</p>
        <a class="focus-ring" href="mailto:oi@claramente.com.br" data-testid="link-email-contato">oi@claramente.com.br ${icon('arrowRight', 16)}</a>
      </div>
    </div>
  </section>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container site-footer__inner">
      ${logo(true)}
      <p>© 2024 ClaraMente. Um diretório independente de psicologia.</p>
      <p class="footer-privacy">${icon('shield', 14)} Respeito, ética e privacidade</p>
    </div>
  </footer>`;
}

function homePage() {
  app.innerHTML = `<div class="grain">
    <a class="skip-link focus-ring" href="#conteudo">Pular para o conteúdo</a>
    ${publicHeader()}
    <main id="conteudo">
      ${hero()}
      ${about()}
      ${directorySection()}
      ${contact()}
    </main>
    ${footer()}
  </div>`;

  bindPublicEvents();
  renderDirectory();
  loadPublicDirectory();
}

function directorySection() {
  return `<section id="profissionais" class="section directory">
    <div class="container">
      <div class="directory__header">
        <div>
          <p class="section-label">Encontre sua escuta</p>
          <h2 class="section-heading">Profissionais para<br><em>o que você vive.</em></h2>
        </div>
        <p class="directory__help">Busque por nome ou tema. Você pode começar apenas olhando — não precisa decidir nada agora.</p>
      </div>
      <div class="filters">
        <div class="search-box">
          <span class="search-box__icon">${icon('search', 18)}</span>
          <input class="field" id="professional-search" type="search" placeholder="Buscar por nome ou especialidade" aria-label="Buscar profissionais">
        </div>
        <div class="filter-list" role="group" aria-label="Filtrar por especialidade">
          ${SPECIALTIES.map((specialty) => `<button class="filter-button focus-ring ${state.specialty === specialty ? 'is-active' : ''}" type="button" data-specialty="${escapeHtml(specialty)}" data-testid="filter-${specialty.toLowerCase()}">${specialty}</button>`).join('')}
        </div>
      </div>
      <div id="directory-status"></div>
      <div id="directory-content"></div>
    </div>
  </section>`;
}

function professionalCard(professional) {
  const phone = professional.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return `<article class="professional-card" data-testid="card-profissional-${escapeHtml(professional.id)}">
    <div class="card-top">
      <div class="professional-avatar" data-testid="avatar-profissional-${escapeHtml(professional.id)}">${escapeHtml(professional.initials)}</div>
      <span class="verified-badge">${icon('check', 13)} Perfil verificado</span>
    </div>
    <h3 data-testid="text-nome-${escapeHtml(professional.id)}">${escapeHtml(professional.name)}</h3>
    <p class="professional-crp">CRP ${escapeHtml(professional.crm)}</p>
    <p class="professional-bio">${escapeHtml(professional.bio)}</p>
    <div class="specialty-list">${professional.specialties.map((specialty) => `<span class="specialty-tag">${escapeHtml(specialty)}</span>`).join('')}</div>
    <div class="professional-meta">
      <div class="meta-item">${icon('location', 14)} ${escapeHtml(professional.location)}</div>
      <div class="meta-item">${icon('stethoscope', 14)} ${escapeHtml(professional.modality)}</div>
    </div>
    <a class="button-primary focus-ring" href="${whatsappUrl}" target="_blank" rel="noreferrer" data-testid="button-whatsapp-${escapeHtml(professional.id)}">${icon('message', 16)} Conversar pelo WhatsApp</a>
  </article>`;
}

function filteredProfessionals() {
  const query = state.search.trim().toLowerCase();
  return state.professionals.filter((professional) => {
    const matchesSearch =
      !query ||
      professional.name.toLowerCase().includes(query) ||
      professional.specialties.some((specialty) => specialty.toLowerCase().includes(query));
    const matchesSpecialty =
      state.specialty === 'Todas' || professional.specialties.includes(state.specialty);
    return matchesSearch && matchesSpecialty;
  });
}

function renderDirectory() {
  const searchInput = document.querySelector('#professional-search');
  if (searchInput) searchInput.value = state.search;

  document.querySelectorAll('[data-specialty]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.specialty === state.specialty);
  });

  const status = document.querySelector('#directory-status');
  const content = document.querySelector('#directory-content');
  if (!status || !content) return;

  status.innerHTML = [
    state.demoMode
      ? '<p class="status status--demo" role="status">Prévia local: estes são dados de demonstração. No Netlify, o catálogo será carregado do armazenamento online.</p>'
      : '',
    state.error ? `<p class="status status--error" role="alert">${escapeHtml(state.error)}</p>` : '',
  ].join('');

  if (state.loading) {
    content.innerHTML = '<div class="loading-state" role="status">Carregando profissionais...</div>';
    return;
  }

  const professionals = filteredProfessionals();
  const hasFilters = Boolean(state.search || state.specialty !== 'Todas');
  const countLabel = `<div class="directory__count"><span><strong>${professionals.length}</strong> profissionais encontrados</span>${hasFilters ? '<button class="text-button focus-ring" type="button" data-action="clear-filters">Limpar filtros</button>' : ''}</div>`;

  if (professionals.length) {
    content.innerHTML = `${countLabel}<div class="cards-grid">${professionals.map(professionalCard).join('')}</div>`;
  } else {
    content.innerHTML = `${countLabel}<div class="empty-state">
      ${icon('search', 25)}
      <h3>Ainda não encontramos esse perfil</h3>
      <p>Tente outro nome ou tema. Se preferir, veja todos os profissionais disponíveis.</p>
      ${button('Ver todos', 'clear-filters', 'button-quiet')}
    </div>`;
  }
}

function bindPublicEvents() {
  document.querySelector('[data-action="toggle-menu"]')?.addEventListener('click', () => {
    state.menuOpen = !state.menuOpen;
    homePage();
  });

  document.querySelectorAll('[data-action="close-menu"]').forEach((link) => {
    link.addEventListener('click', () => { state.menuOpen = false; });
  });

  document.querySelector('#professional-search')?.addEventListener('input', (event) => {
    state.search = event.target.value;
    renderDirectory();
    const input = document.querySelector('#professional-search');
    input?.focus();
    input?.setSelectionRange(state.search.length, state.search.length);
  });

  document.querySelectorAll('[data-specialty]').forEach((button) => {
    button.addEventListener('click', () => {
      state.specialty = button.dataset.specialty;
      renderDirectory();
    });
  });

  document.addEventListener('click', handleGlobalAction, { once: true });
}

function handleGlobalAction(event) {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) {
    document.addEventListener('click', handleGlobalAction, { once: true });
    return;
  }
  if (actionElement.dataset.action === 'clear-filters') {
    state.search = '';
    state.specialty = 'Todas';
    renderDirectory();
  }
  document.addEventListener('click', handleGlobalAction, { once: true });
}

async function loadPublicDirectory() {
  if (isLocal) {
    state.professionals = SEED_PROFESSIONALS;
    state.demoMode = true;
    state.loading = false;
    renderDirectory();
    return;
  }

  state.loading = true;
  renderDirectory();
  try {
    state.professionals = await apiRequest('/api/professionals');
    state.demoMode = false;
    state.error = '';
  } catch (error) {
    state.professionals = [];
    state.error = error.message || 'Não foi possível carregar os profissionais.';
  } finally {
    state.loading = false;
    renderDirectory();
  }
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Não foi possível concluir essa operação.');
  return payload;
}

function adminHeader() {
  return `<header class="admin-header">
    <div class="container admin-header__inner">
      ${logo()}
      <div class="admin-header__actions">
        <span class="admin-tagline">Gestão segura do diretório</span>
        ${state.user ? button('Sair', 'logout', 'button-quiet', 'logout') : ''}
        <a class="button-quiet focus-ring" href="/" data-action="go-home">Voltar ao portal</a>
      </div>
    </div>
  </header>`;
}

function adminPage() {
  app.innerHTML = `<div class="admin-page grain">
    ${adminHeader()}
    <main class="container admin-main" id="admin-content"></main>
    <footer class="container admin-footer">ClaraMente · Gestão protegida por autenticação</footer>
  </div>`;

  bindAdminShellEvents();
  initializeIdentity();
}

function bindAdminShellEvents() {
  document.querySelector('[data-action="logout"]')?.addEventListener('click', logout);
  document.querySelector('[data-action="go-home"]')?.addEventListener('click', (event) => {
    if (event.currentTarget.getAttribute('href') === '/') return;
    event.preventDefault();
    window.location.href = '/';
  });
}

function initializeIdentity() {
  const identity = window.netlifyIdentity;
  state.identityConfigured = !isLocal && Boolean(identity);

  if (!state.identityConfigured) {
    renderAdminContent();
    return;
  }

  identity.init();
  state.user = identity.currentUser();
  identity.on('login', (user) => {
    state.user = user || identity.currentUser();
    state.adminLoaded = false;
    state.adminDenied = false;
    renderAdminContent();
  });
  identity.on('logout', () => {
    state.user = null;
    state.adminProfessionals = [];
    state.adminLoaded = false;
    renderAdminContent();
  });
  renderAdminContent();
}

function renderAdminContent() {
  const content = document.querySelector('#admin-content');
  if (!content) return;

  if (!state.identityConfigured || !state.user || state.adminDenied) {
    content.innerHTML = adminGate();
    document.querySelector('[data-action="login"]')?.addEventListener('click', login);
    document.querySelector('[data-action="logout"]')?.addEventListener('click', logout);
    return;
  }

  content.innerHTML = adminDashboard();
  bindAdminDashboardEvents();
  if (!state.adminLoaded && !state.adminLoading) loadAdminDirectory();
}

function adminGate() {
  let message = 'Entre com a conta autorizada no Netlify para gerenciar os profissionais publicados.';
  let action = button('Entrar como ADM', 'login', 'button-primary', 'login');

  if (!state.identityConfigured) {
    message = 'A autenticação do Netlify será ativada quando o portal for publicado e o Netlify Identity estiver configurado. Nenhuma senha é armazenada no site.';
    action = '';
  } else if (state.user) {
    message = `A conta <strong>${escapeHtml(state.user.email || 'atual')}</strong> não possui permissão de administrador.`;
    action = button('Sair', 'logout', 'button-quiet', 'logout');
  }

  return `<section class="admin-gate">
    <div class="admin-gate__icon">${icon('shield', 26)}</div>
    <p class="admin-gate__label">Área restrita</p>
    <h1>Acesso do administrador</h1>
    <p>${message}</p>
    ${action}
  </section>`;
}

function adminDashboard() {
  return `<div class="admin-title-row">
    <div>
      <p class="section-label">Área restrita</p>
      <h1>Profissionais</h1>
      <p>As alterações são salvas online e aparecem para todos os visitantes.</p>
    </div>
    ${button(state.formOpen ? 'Fechar cadastro' : 'Novo profissional', 'toggle-form', 'button-primary', state.formOpen ? 'x' : 'plus')}
  </div>
  ${state.notice ? `<div class="notice" role="status">${icon('check', 17)} ${escapeHtml(state.notice)}</div>` : ''}
  ${state.adminError ? `<div class="admin-error" role="alert">${escapeHtml(state.adminError)}</div>` : ''}
  ${state.formOpen ? professionalForm() : ''}
  ${adminDirectoryList()}`;
}

function professionalForm() {
  const field = (key, label, placeholder, testId, type = 'text') => `<label class="form-label">
    ${label}
    <input class="field" type="${type}" value="${escapeHtml(state.form[key])}" data-field="${key}" placeholder="${placeholder}" data-testid="${testId}">
  </label>`;

  return `<form class="admin-form animate-rise" id="professional-form" data-testid="form-profissional">
    <div class="admin-form__heading">
      <div class="admin-form__icon">${icon('user', 20)}</div>
      <div><h2>Adicionar ao diretório</h2><p>As informações aparecerão publicamente depois de salvar.</p></div>
    </div>
    <div class="admin-form__grid">
      ${field('name', 'Nome completo', 'Ex.: Beatriz Sampaio', 'input-nome')}
      ${field('crm', 'CRP', '06/000.000', 'input-crp')}
      <label class="form-label form-label--wide">Bio curta
        <textarea class="field" rows="4" data-field="bio" placeholder="Como você trabalha e quem acompanha?" data-testid="input-bio">${escapeHtml(state.form.bio)}</textarea>
      </label>
      <label class="form-label">Especialidades <small>(separe por vírgulas)</small>
        <input class="field" type="text" value="${escapeHtml(state.form.specialties)}" data-field="specialties" placeholder="Ansiedade, Trauma" data-testid="input-especialidades">
      </label>
      ${field('whatsapp', 'WhatsApp', '(11) 99999-9999', 'input-whatsapp')}
      ${field('location', 'Localização', 'São Paulo, SP', 'input-localizacao')}
      <label class="form-label">Modalidade
        <select class="field" data-field="modality" data-testid="select-modalidade">
          ${['Online', 'Presencial', 'Online e presencial'].map((value) => `<option ${state.form.modality === value ? 'selected' : ''}>${value}</option>`).join('')}
        </select>
      </label>
      <label class="form-label">Iniciais do avatar <small>(opcional)</small>
        <input class="field" type="text" maxlength="3" value="${escapeHtml(state.form.initials)}" data-field="initials" placeholder="BS" data-testid="input-iniciais">
      </label>
    </div>
    <div class="admin-form__actions">
      ${button('Cancelar', 'cancel-form', 'button-quiet')}
      <button class="button-primary focus-ring" type="submit" ${state.adminLoading ? 'disabled' : ''} data-testid="button-salvar-profissional">${icon('plus', 17)} Salvar profissional</button>
    </div>
  </form>`;
}

function adminDirectoryList() {
  const body = state.adminLoading
    ? '<div class="loading-state">Carregando catálogo seguro...</div>'
    : state.adminProfessionals.length
      ? `<div class="admin-list">${state.adminProfessionals.map(adminRow).join('')}</div>`
      : `<div class="empty-state">${icon('sparkles', 25)}<h3>O diretório está vazio</h3><p>Adicione o primeiro profissional para começar.</p></div>`;

  return `<section class="directory-panel">
    <div class="directory-panel__header">
      <div><h2>Diretório atual</h2><p>${state.adminLoading ? 'Carregando...' : `${state.adminProfessionals.length} perfis publicados`}</p></div>
      ${icon('stethoscope', 20)}
    </div>
    ${body}
  </section>`;
}

function adminRow(professional) {
  return `<div class="admin-row" data-testid="row-profissional-${escapeHtml(professional.id)}">
    <div class="admin-row__identity">
      <div class="admin-avatar">${escapeHtml(professional.initials)}</div>
      <div>
        <p class="admin-row__name">${escapeHtml(professional.name)}</p>
        <p class="admin-row__meta">CRP ${escapeHtml(professional.crm)} · ${escapeHtml(professional.location)}</p>
        <div class="admin-row__specialties">${professional.specialties.map((specialty) => `<span class="specialty-tag">${escapeHtml(specialty)}</span>`).join('')}</div>
      </div>
    </div>
    <button class="delete-button focus-ring" type="button" data-delete-id="${escapeHtml(professional.id)}" data-testid="button-excluir-${escapeHtml(professional.id)}">${icon('trash', 15)} Excluir</button>
  </div>`;
}

function bindAdminDashboardEvents() {
  document.querySelector('[data-action="toggle-form"]')?.addEventListener('click', () => {
    state.formOpen = !state.formOpen;
    state.notice = '';
    state.adminError = '';
    renderAdminContent();
  });
  document.querySelector('[data-action="cancel-form"]')?.addEventListener('click', () => {
    state.formOpen = false;
    state.form = { ...DEFAULT_FORM };
    renderAdminContent();
  });
  document.querySelector('#professional-form')?.addEventListener('submit', submitProfessional);
  document.querySelectorAll('[data-field]').forEach((field) => {
    field.addEventListener('input', () => {
      state.form[field.dataset.field] = field.value;
    });
  });
  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => removeProfessional(button.dataset.deleteId));
  });
}

async function loadAdminDirectory() {
  if (!state.user?.token?.access_token) return;
  state.adminLoading = true;
  renderAdminListOnly();
  try {
    state.adminProfessionals = await apiRequest('/api/professionals?scope=admin', {
      token: state.user.token.access_token,
    });
    state.adminDenied = false;
    state.adminError = '';
    state.adminLoaded = true;
  } catch (error) {
    state.adminDenied = error.message?.toLowerCase().includes('permissão') || error.message?.toLowerCase().includes('administrador');
    state.adminError = state.adminDenied ? '' : (error.message || 'Não foi possível carregar o diretório.');
    state.adminLoaded = true;
  } finally {
    state.adminLoading = false;
    renderAdminContent();
  }
}

function renderAdminListOnly() {
  const panel = document.querySelector('.directory-panel');
  if (panel) panel.outerHTML = adminDirectoryList();
}

function collectProfessionalInput() {
  const name = state.form.name.trim();
  const specialties = state.form.specialties.split(',').map((item) => item.trim()).filter(Boolean);
  const initials = state.form.initials.trim().slice(0, 3).toUpperCase() ||
    name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  return {
    name,
    crm: state.form.crm.trim(),
    bio: state.form.bio.trim(),
    specialties,
    whatsapp: state.form.whatsapp.trim(),
    location: state.form.location.trim(),
    modality: state.form.modality,
    initials,
  };
}

async function submitProfessional(event) {
  event.preventDefault();
  const input = collectProfessionalInput();
  if (!input.name || !input.crm || !input.bio || !input.specialties.length || !input.whatsapp || !input.location) {
    state.adminError = 'Preencha todos os campos obrigatórios para cadastrar o profissional.';
    renderAdminContent();
    return;
  }

  state.adminLoading = true;
  state.adminError = '';
  try {
    const created = await apiRequest('/api/professionals', {
      method: 'POST',
      token: state.user?.token?.access_token,
      body: input,
    });
    state.adminProfessionals.push(created);
    state.form = { ...DEFAULT_FORM };
    state.formOpen = false;
    state.notice = `${created.name} foi publicado no diretório.`;
  } catch (error) {
    state.adminError = error.message || 'Não foi possível publicar o profissional.';
  } finally {
    state.adminLoading = false;
    renderAdminContent();
  }
}

async function removeProfessional(id) {
  const professional = state.adminProfessionals.find((item) => item.id === id);
  if (!professional || !window.confirm(`Remover ${professional.name} do diretório? Essa ação será refletida para todos os visitantes.`)) return;

  state.adminError = '';
  state.notice = '';
  try {
    await apiRequest(`/api/professionals/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      token: state.user?.token?.access_token,
    });
    state.adminProfessionals = state.adminProfessionals.filter((item) => item.id !== id);
    state.notice = `${professional.name} foi removido do diretório.`;
  } catch (error) {
    state.adminError = error.message || 'Não foi possível remover o profissional.';
  }
  renderAdminContent();
}

function login() {
  window.netlifyIdentity?.open('login');
}

function logout() {
  window.netlifyIdentity?.logout();
}

function start() {
  if (window.location.pathname === '/admin') {
    adminPage();
  } else {
    homePage();
  }
}

document.addEventListener('DOMContentLoaded', start);