const json=(payload,status=200)=>Response.json(payload,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const str=(s,n)=>typeof s==='string'?s.slice(0,n):'';
export default async function handler(request){
 if(request.method!=='POST')return json({error:'Método não permitido.'},405);
 const key=process.env.OPENAI_API_KEY,secret=process.env.APP_ACCESS_CODE;
 const root=(process.env.OPENAI_BASE_URL||'https://api.openai.com').replace(/\/+$/,'').replace(/\/v1$/,'');
 if(!key||!secret)return json({error:'API não configurada.'},503);
 if(request.headers.get('x-access-code')!==secret)return json({error:'Código privado inválido. Abra Configurações.'},401);
 let input;try{input=await request.json();}catch{return json({error:'Dados inválidos.'},400);}
 if(!Number.isFinite(Number(input?.age))||Number(input.age)<18)return json({error:'Apenas personagens adultos.'},400);
 const name=str(input.name,80),personality=str(input.personality,1300),scene=str(input.scene,560),appearance=str(input.appearance,800);
 if(scene.length<10)return json({error:'Descreva a cena.'},400);
 const prompt=`Ilustração digital cinematográfica original, personagem fictício inequivocamente adulto de ${input.age} anos. Nome: ${name}. Aparência narrativa: ${appearance}. Personalidade que influencia expressão/gestos: ${personality}. CENA: ${scene}. Retrato artístico de alta qualidade, elegante, atraente e romântico, luz suave, detalhes sofisticados, sem marcas d'água, sem letras. Sem nudez explícita, sem atividades sexuais, sem representação de menores e sem pessoas reais.`;
 try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),40000);
  const r=await fetch(`${root}/v1/images/generations`,{method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt,size:'1024x1024',quality:'low',n:1}),signal:controller.signal});clearTimeout(timeout);
  const data=await r.json().catch(()=>({}));if(!r.ok)return json({error:str(data.error?.message||`Erro API ${r.status}`,230)},502);
  const img=data?.data?.[0]?.b64_json;if(!img)return json({error:'A IA não retornou uma imagem.'},502);
  return json({base64:img,mime:'image/png'});
 }catch(error){return json({error:error?.name==='AbortError'?'A geração excedeu o tempo disponível.':'Falha na geração da imagem.'},502);}
}
