import { SEED_FAQ, SEED_PROFESSIONALS } from '../public/seed-data.js';

const DIRECTORY_KEY = 'professionals.json';
const FAQ_KEY = 'faq.json';

// Enquanto o ADM não grava nada, o KV está vazio e valem os dados de exemplo.
export async function getDirectory(env) {
  const stored = await env.DIRECTORY.get(DIRECTORY_KEY, 'json');
  return Array.isArray(stored) ? stored : SEED_PROFESSIONALS;
}

export async function saveDirectory(env, professionals) {
  await env.DIRECTORY.put(DIRECTORY_KEY, JSON.stringify(professionals));
}

export async function getFaq(env) {
  const stored = await env.DIRECTORY.get(FAQ_KEY, 'json');
  return Array.isArray(stored) ? stored : SEED_FAQ;
}

export async function saveFaq(env, items) {
  await env.DIRECTORY.put(FAQ_KEY, JSON.stringify(items));
}
