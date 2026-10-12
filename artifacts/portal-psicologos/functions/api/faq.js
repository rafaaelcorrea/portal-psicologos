import { response } from '../../lib/http.js';
import { getFaq } from '../../lib/store.js';

// Leitura pública das dúvidas. Criar, editar e excluir ficam em /api/admin/faq.
export async function onRequestGet({ env }) {
  try {
    return response(await getFaq(env));
  } catch (error) {
    console.error('FAQ function error', error);
    return response({ code: 'FAQ_ERROR', message: 'Não foi possível acessar as dúvidas frequentes agora.' }, 500);
  }
}
