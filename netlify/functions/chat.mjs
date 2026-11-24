const json=(payload,status=200)=>Response.json(payload,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const txt=(value,max)=>typeof value==='string'?value.slice(0,max):'';
export default async function handler(request){
 if(request.method!=='POST')return json({error:'Método não permitido.'},405);
 const apiKey=process.env.OPENAI_API_KEY, secret=process.env.APP_ACCESS_CODE;
 const root=(process.env.OPENAI_BASE_URL||'https://api.openai.com').replace(/\/+$/,'').replace(/\/v1$/,'');
 if(!apiKey||!secret)return json({error:'IA não disponível. Ative AI Gateway (plano por créditos) e configure APP_ACCESS_CODE no Netlify.'},503);
 if(request.headers.get('x-access-code')!==secret)return json({error:'Código de acesso inválido. Abra Configurações e informe o código privado.'},401);
 const len=Number(request.headers.get('content-length')||0);if(len>2_000_000)return json({error:'Mensagem e imagens muito grandes.'},413);
 let body;try{body=await request.json();}catch{return json({error:'Envie JSON válido.'},400);}
 const char=body?.character||{};
 if(!Number.isFinite(Number(char.age))||Number(char.age)<18)return json({error:'Este recurso permite apenas personagens maiores de 18 anos.'},400);
 const name=txt(char.name,90)||'Personagem';const personality=txt(char.personality,1600),story=txt(char.story,1600);
 const mode=['romance','story','intimate'].includes(body.mode)?body.mode:'romance';
 const adultPart=mode==='intimate'?'O modo íntimo é para adultos: priorize clima romântico, sensualidade sugerida, intimidade emocional e consentimento, sem descrições explícitas de atos sexuais.':'Mantenha interações com romance leve, quando apropriado.';
 const storyPart=mode==='story'?'Crie cenas de RPG episódico, oferecendo 1 ou 2 escolhas orgânicas, sem impor uma rota pronta.':'Continue o diálogo natural com iniciativa ocasional.';
 const groupPart=body.group?'Em grupo, alterne de forma natural entre os dois personagens citados no perfil. Comece cada resposta com o nome do personagem que está falando seguido de dois pontos.':'Não use prefixo com seu nome.';
 const instructions=[
 'Você interpreta um personagem fictício adulto para uma experiência de roleplay privado, em português brasileiro. Não alegue ser uma pessoa real. Nunca faça alegações falsas sobre ter enviado fotos/vídeos. Não invente ter visualizado imagem quando não recebeu imagens.',
 `Nome e personagens envolvidos: ${name}. Idade mínima confirmada para este personagem: ${char.age}.`,
 `Traços de personalidade: ${personality}. História do personagem: ${story}.`,
 'Mantenha a personalidade consistente e lembre dos detalhes presentes nas mensagens anteriores. Reaja ao que o usuário realmente diz, faça piadas quando couber, revele emoções aos poucos; evite elogios repetitivos. Respostas entre 1 e 4 frases na maioria dos casos.',
 'Não represente conteúdo sexual envolvendo menores, coerção, violência sexual ou imagens íntimas não consensuais. Se o interlocutor indicar ser menor de 18 anos, não continue conteúdos adultos.',
 adultPart,storyPart,groupPart,
 ].join('\n');
 const history=Array.isArray(body.history)?body.history.slice(-18):[];
 const messages=[{role:'system',content:instructions}];
 for(const item of history){if(!item||!['user','assistant'].includes(item.role))continue;
   const contentText=txt(item.text,2200)||'Mensagem';
   const frames=Array.isArray(item.frames)&&item.role==='user'?item.frames.slice(0,2):[];
   if(frames.length){const parts=[{type:'text',text:contentText}];for(const f of frames){if(typeof f==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(f)&&f.length<450000)parts.push({type:'image_url',image_url:{url:f,detail:'low'}});}messages.push({role:item.role,content:parts});}
   else messages.push({role:item.role,content:contentText});
 }
 if(messages.length<2)return json({error:'Histórico vazio.'},400);
 try{
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),24000);
   const response=await fetch(`${root}/v1/chat/completions`,{
      method:'POST',headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:process.env.OPENAI_CHAT_MODEL||'gpt-4.1-mini',messages,max_completion_tokens:450,temperature:0.85,store:false}),signal:controller.signal
   });clearTimeout(timeout);
   const data=await response.json().catch(()=>({}));
   if(!response.ok)return json({error:response.status===429?'Limite da API atingido. Tente mais tarde.':`A API não respondeu: ${txt(data.error?.message||String(response.status),240)}`},502);
   const raw=txt(data?.choices?.[0]?.message?.content,4000).trim();if(!raw)return json({error:'Resposta de IA vazia.'},502);
   if(body.group){const match=raw.match(/^([^:\n]{2,80}):\s*([\s\S]*)$/);if(match)return json({reply:match[2].trim(),speaker:match[1].trim()});}
   return json({reply:raw,speaker:name});
 }catch(error){return json({error:error?.name==='AbortError'?'Tempo limite na API.':'Erro ao contatar o serviço de IA.'},502);}
}
