export default async function handler(request) {
  if(request.method !== 'GET') return new Response('Método não permitido',{status:405});
  const key=process.env.OPENAI_API_KEY||'';
  const code=process.env.APP_ACCESS_CODE||'';
  const provided=request.headers.get('x-access-code')||'';
  return Response.json({configured:Boolean(key&&code),authorized:Boolean(key&&code&&provided===code),imageGeneration:Boolean(key&&code&&provided===code)}, {headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
