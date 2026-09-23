import { getStore } from '@netlify/blobs';

const STORE_NAME = 'claramente-directory';
const DIRECTORY_KEY = 'professionals.json';

const seedProfessionals = [
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

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

function response(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}

function getUser(context) {
  return context?.clientContext?.user ?? null;
}

function isAdmin(user) {
  if (!user) return false;
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();
  const roles = user.app_metadata?.roles ?? [];
  return roles.includes('admin') || Boolean(configuredEmail && userEmail === configuredEmail);
}

function requireAdmin(context) {
  const user = getUser(context);
  if (!user) return response({ code: 'AUTH_REQUIRED', message: 'Faça login para acessar a área administrativa.' }, 401);
  if (!isAdmin(user)) return response({ code: 'ADMIN_REQUIRED', message: 'Esta conta não possui permissão de administrador.' }, 403);
  return null;
}

function validateProfessional(input) {
  const fields = ['name', 'crm', 'bio', 'whatsapp', 'location', 'modality', 'initials'];
  if (!input || typeof input !== 'object') return 'Envie os dados do profissional.';
  if (fields.some((field) => typeof input[field] !== 'string' || !input[field].trim())) return 'Preencha todos os campos obrigatórios.';
  if (!Array.isArray(input.specialties) || input.specialties.length === 0 || input.specialties.some((specialty) => typeof specialty !== 'string' || !specialty.trim())) return 'Informe ao menos uma especialidade.';
  if (input.whatsapp.replace(/\D/g, '').length < 10) return 'Informe um WhatsApp válido.';
  if (input.name.trim().length > 120 || input.bio.trim().length > 500) return 'Alguns campos ultrapassaram o limite permitido.';
  return null;
}

async function getDirectory() {
  const store = getStore(STORE_NAME);
  const stored = await store.get(DIRECTORY_KEY, { type: 'json' });
  return Array.isArray(stored) ? stored : seedProfessionals;
}

async function saveDirectory(professionals) {
  const store = getStore(STORE_NAME);
  await store.setJSON(DIRECTORY_KEY, professionals);
}

function allowOrigin(request) {
  const configured = process.env.ALLOWED_ORIGIN?.trim();
  const requestOrigin = request.headers.get('origin');
  return configured || (requestOrigin && requestOrigin.endsWith('.netlify.app') ? requestOrigin : '');
}

export default async (request, context) => {
  const corsHeaders = allowOrigin(request) ? { 'Access-Control-Allow-Origin': allowOrigin(request), Vary: 'Origin' } : {};
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { ...corsHeaders, 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, DELETE' } });
  }

  const url = new URL(request.url);
  const adminScope = url.searchParams.get('scope') === 'admin';
  if (adminScope || request.method !== 'GET') {
    const denied = requireAdmin(context);
    if (denied) return denied;
  }

  try {
    const professionals = await getDirectory();
    if (request.method === 'GET') return response(professionals, 200, corsHeaders);

    if (request.method === 'POST') {
      const input = await request.json();
      const validationError = validateProfessional(input);
      if (validationError) return response({ code: 'VALIDATION_ERROR', message: validationError }, 400, corsHeaders);
      const professional = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        crm: input.crm.trim(),
        bio: input.bio.trim(),
        specialties: [...new Set(input.specialties.map((specialty) => specialty.trim()).filter(Boolean))],
        whatsapp: input.whatsapp.trim(),
        location: input.location.trim(),
        modality: input.modality.trim(),
        initials: input.initials.trim().slice(0, 3).toUpperCase(),
      };
      await saveDirectory([...professionals, professional]);
      return response(professional, 201, corsHeaders);
    }

    if (request.method === 'DELETE') {
      const id = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '');
      const nextProfessionals = professionals.filter((professional) => professional.id !== id);
      if (nextProfessionals.length === professionals.length) return response({ code: 'NOT_FOUND', message: 'Profissional não encontrado.' }, 404, corsHeaders);
      await saveDirectory(nextProfessionals);
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return response({ code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405, corsHeaders);
  } catch (error) {
    console.error('Directory function error', error);
    return response({ code: 'DIRECTORY_ERROR', message: 'Não foi possível acessar o diretório agora.' }, 500, corsHeaders);
  }
};