// Autenticação pelo Cloudflare Access.
// O Access faz o login (código enviado por e-mail) e entrega a cada pedido um token
// assinado no cabeçalho Cf-Access-Jwt-Assertion. Aqui conferimos se esse token é
// verdadeiro e se foi emitido para este site.

const KEYS_TTL_MS = 60 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let cachedKeys = { issuer: '', keys: [], fetchedAt: 0 };

function fromBase64Url(value) {
  const binary = atob(value.replaceAll('-', '+').replaceAll('_', '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function issuer(env) {
  const domain = env.ACCESS_TEAM_DOMAIN?.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return domain ? `https://${domain}` : '';
}

export function isAccessConfigured(env) {
  return Boolean(issuer(env) && env.ACCESS_AUD?.trim());
}

// As chaves públicas do Access mudam de tempos em tempos; guardamos por uma hora.
async function getKeys(env, forceRefresh = false) {
  const currentIssuer = issuer(env);
  const fresh = cachedKeys.issuer === currentIssuer && Date.now() - cachedKeys.fetchedAt < KEYS_TTL_MS;
  if (fresh && !forceRefresh) return cachedKeys.keys;

  const result = await fetch(`${currentIssuer}/cdn-cgi/access/certs`);
  if (!result.ok) throw new Error(`Access certs responded ${result.status}`);
  const { keys } = await result.json();
  cachedKeys = { issuer: currentIssuer, keys: Array.isArray(keys) ? keys : [], fetchedAt: Date.now() };
  return cachedKeys.keys;
}

async function findKey(env, kid) {
  const known = (await getKeys(env)).find((key) => key.kid === kid);
  return known ?? (await getKeys(env, true)).find((key) => key.kid === kid);
}

export async function getAccessUser(request, env) {
  if (!isAccessConfigured(env)) return null;
  const [header, payload, signature] = request.headers.get('Cf-Access-Jwt-Assertion')?.split('.') ?? [];
  if (!header || !payload || !signature) return null;

  try {
    const { alg, kid } = JSON.parse(decoder.decode(fromBase64Url(header)));
    if (alg !== 'RS256') return null;
    const jwk = await findKey(env, kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, fromBase64Url(signature), encoder.encode(`${header}.${payload}`));
    if (!valid) return null;

    const claims = JSON.parse(decoder.decode(fromBase64Url(payload)));
    const audiences = [claims.aud].flat();
    if (!audiences.includes(env.ACCESS_AUD.trim())) return null;
    if (claims.iss !== issuer(env)) return null;
    if (typeof claims.exp !== 'number' || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    if (typeof claims.email !== 'string' || !claims.email) return null;
    return { email: claims.email.toLowerCase() };
  } catch (error) {
    console.error('Access token check failed', error);
    return null;
  }
}

// Segunda barreira contra CSRF: gravações só são aceitas vindas do próprio site.
export function isSameOrigin(request) {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin;
}
