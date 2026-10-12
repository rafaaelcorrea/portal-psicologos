import { response } from '../../../../lib/http.js';
import { getFaq, saveFaq } from '../../../../lib/store.js';

// Gestão das dúvidas frequentes. O login é conferido antes, em ../_middleware.js.

// Limites aplicados a tudo o que o ADM salva.
const FAQ_LIMITS = {
  maxItems: 30,
  maxQuestionLength: 200,
  maxAnswerLength: 2000,
};

function validateItem(item) {
  if (typeof item.question !== 'string' || !item.question.trim() || typeof item.answer !== 'string' || !item.answer.trim()) return 'Preencha a pergunta e a resposta.';
  if (item.question.trim().length > FAQ_LIMITS.maxQuestionLength) return `A pergunta pode ter até ${FAQ_LIMITS.maxQuestionLength} caracteres.`;
  if (item.answer.trim().length > FAQ_LIMITS.maxAnswerLength) return `A resposta pode ter até ${FAQ_LIMITS.maxAnswerLength} caracteres.`;
  return null;
}

export async function onRequest({ request, env, params }) {
  try {
    const items = await getFaq(env);
    if (request.method === 'GET') return response(items);

    const input = request.method === 'DELETE' ? null : await request.json().catch(() => null);
    const id = [params.path ?? []].flat()[0] ?? '';

    if (request.method === 'POST') {
      if (items.length >= FAQ_LIMITS.maxItems) return response({ code: 'LIMIT_REACHED', message: `O limite é de ${FAQ_LIMITS.maxItems} perguntas.` }, 400);
      const validationError = validateItem(input ?? {});
      if (validationError) return response({ code: 'VALIDATION_ERROR', message: validationError }, 400);
      const item = { id: crypto.randomUUID(), question: input.question.trim(), answer: input.answer.trim() };
      await saveFaq(env, [...items, item]);
      return response(item, 201);
    }

    const index = items.findIndex((item) => item.id === id);
    if ((request.method === 'PUT' || request.method === 'DELETE') && index === -1) {
      return response({ code: 'NOT_FOUND', message: 'Pergunta não encontrada.' }, 404);
    }

    // PUT aceita atualização parcial: texto, posição na lista ou ambos.
    if (request.method === 'PUT') {
      const merged = { ...items[index], question: input?.question ?? items[index].question, answer: input?.answer ?? items[index].answer };
      const validationError = validateItem(merged);
      if (validationError) return response({ code: 'VALIDATION_ERROR', message: validationError }, 400);
      const item = { id, question: merged.question.trim(), answer: merged.answer.trim() };
      const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
      const position = Number.isInteger(input?.position) ? Math.min(Math.max(input.position, 0), nextItems.length) : index;
      nextItems.splice(position, 0, item);
      await saveFaq(env, nextItems);
      return response(item);
    }

    if (request.method === 'DELETE') {
      await saveFaq(env, items.filter((item) => item.id !== id));
      return new Response(null, { status: 204 });
    }

    return response({ code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405);
  } catch (error) {
    console.error('FAQ function error', error);
    return response({ code: 'FAQ_ERROR', message: 'Não foi possível acessar as dúvidas frequentes agora.' }, 500);
  }
}
