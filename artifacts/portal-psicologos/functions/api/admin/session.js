import { response } from '../../../lib/http.js';

// Só chega aqui quem passou pelo _middleware.js; ele já deixou o usuário em data.user.
export function onRequestGet({ data }) {
  return response({ user: data.user });
}
