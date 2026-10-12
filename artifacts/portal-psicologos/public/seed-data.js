// Dados iniciais do portal. Este é o único lugar onde eles existem:
// o site (app.js) e a API (functions/) importam daqui.

export const SEED_PROFESSIONALS = [
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

export const SEED_FAQ = [
  {
    id: 'como-escolher',
    question: 'Como escolho um profissional?',
    answer: 'Use a busca e os filtros por especialidade para encontrar perfis ligados ao que você está vivendo. Leia a apresentação de cada profissional e converse com quem fizer sentido para você.',
  },
  {
    id: 'primeiro-contato',
    question: 'Como funciona o primeiro contato?',
    answer: 'O contato é feito diretamente com o profissional pelo WhatsApp. Vocês combinam entre si horários, valores e o formato do atendimento.',
  },
  {
    id: 'atendimento-online',
    question: 'O atendimento pode ser online?',
    answer: 'Sim. Cada perfil informa se o profissional atende online, presencialmente ou nas duas modalidades.',
  },
  {
    id: 'custo-do-portal',
    question: 'Preciso pagar para usar o portal?',
    answer: 'Não. Consultar o diretório e entrar em contato com os profissionais é gratuito. O valor das sessões é definido por cada profissional.',
  },
];
