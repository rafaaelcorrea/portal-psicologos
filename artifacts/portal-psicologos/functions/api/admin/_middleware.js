import { getAccessUser, isAccessConfigured, isSameOrigin } from '../../../lib/auth.js';
import { response } from '../../../lib/http.js';

// Roda antes de qualquer função dentro de /api/admin. Se o pedido não vier de um
// administrador autenticado pelo Cloudflare Access, ele para aqui.
export async function onRequest(context) {
  const { request, env } = context;

  if (!isAccessConfigured(env)) {
    return response({ code: 'ACCESS_NOT_CONFIGURED', message: 'O acesso administrativo ainda não foi configurado neste site.' }, 503);
  }
  if (request.method !== 'GET' && !isSameOrigin(request)) {
    return response({ code: 'FORBIDDEN_ORIGIN', message: 'Origem não permitida.' }, 403);
  }

  const user = await getAccessUser(request, env);
  if (!user) return response({ code: 'AUTH_REQUIRED', message: 'Faça login para acessar a área administrativa.' }, 401);

  context.data.user = user;
  const result = await context.next();
  const guarded = new Response(result.body, result);
  guarded.headers.set('Cache-Control', 'no-store');
  return guarded;
}
