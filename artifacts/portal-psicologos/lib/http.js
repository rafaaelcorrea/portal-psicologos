const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

export function response(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}
