import { response } from '../../lib/http.js';
import { getDirectory } from '../../lib/store.js';

// Leitura pública do diretório. Criar, editar e excluir ficam em /api/admin/professionals.
export async function onRequest({ request, env }) {
  // A leitura pode ser liberada para outro domínio; a área administrativa só funciona na mesma origem.
  const allowedOrigin = env.ALLOWED_ORIGIN?.trim();
  const corsHeaders = allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin, Vary: 'Origin' } : {};
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET' } });
  }
  if (request.method !== 'GET') return response({ code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405);

  try {
    return response(await getDirectory(env), 200, corsHeaders);
  } catch (error) {
    console.error('Directory function error', error);
    return response({ code: 'DIRECTORY_ERROR', message: 'Não foi possível acessar o diretório agora.' }, 500);
  }
}
