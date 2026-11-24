import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const defaultConfig=()=>({version:0,updatedAt:null,title:'Lunaria',subtitle:'Histórias que florescem',accent:'#926b77',characters:[],announcement:''});
const safe=(value,max)=>String(value??'').trim().slice(0,max);
const safeImage=(value)=>{const s=safe(value,500);return /^https:\/\//i.test(s)||/^\/\.netlify\/functions\/media\?id=[\w-]+$/.test(s)||/^\/assets\/[\w.-]+$/.test(s)?s:'';};
const secureEqual=(x,y)=>{const a=Buffer.from(String(x)),b=Buffer.from(String(y));return a.length===b.length&&a.length>0&&timingSafeEqual(a,b);};
const studioStore=()=>getStore('lunaria-v2-studio');
async function getConfig(){try{return await studioStore().get('published-config',{type:'json',consistency:'strong'})||defaultConfig();}catch(err){console.error('studio_read',err);throw err;}}
function sanitize(input,old){const chars=Array.isArray(input.characters)?input.characters.slice(0,45):[];const seen=new Set();return {
 version:(Number(old.version)||0)+1,updatedAt:new Date().toISOString(),title:safe(input.title,55)||'Lunaria',subtitle:safe(input.subtitle,100),announcement:safe(input.announcement,220),accent:/^#[0-9a-fA-F]{6}$/.test(input.accent)?input.accent:'#926b77',
 characters:chars.map(x=>{const id=safe(x?.id,60).toLowerCase();const age=Number(x?.age)||0;if(!/^[a-z0-9_-]{2,60}$/.test(id)||seen.has(id)||age<18||age>110)return null;seen.add(id);return {id,name:safe(x.name,80),origin:safe(x.origin,90)||'Original',category:safe(x.category,35)||'originais',age,image:safeImage(x.image),personality:safe(x.personality,1700),story:safe(x.story,1700),intro:safe(x.intro,1200),openingNarration:safe(x.openingNarration,1600)};}).filter(Boolean)
 };}
export default async function handler(request){
 if(request.method==='GET')try{return reply({config:await getConfig()});}catch{return reply({error:'Configuração temporariamente indisponível.'},503);}
 if(request.method!=='POST')return reply({error:'Método não permitido.'},405);
 const secret=process.env.ADMIN_ACCESS_CODE||'';
 if(secret.length<20)return reply({error:'Defina ADMIN_ACCESS_CODE (20+ caracteres) nas variáveis do Netlify.'},503);
 const provided=request.headers.get('x-admin-code')||'';
 if(!secureEqual(provided,secret))return reply({error:'Código administrativo inválido.'},401);
 if(Number(request.headers.get('content-length')||0)>2400000)return reply({error:'Dados muito grandes.'},413);
 let data;try{data=await request.json()}catch{return reply({error:'JSON inválido.'},400)};
 if(data?.action==='verify')return reply({ok:true});
 if(data?.action==='save'){
  try{const prev=await getConfig();const config=sanitize(data.config||{},prev);await studioStore().setJSON('published-config',config);return reply({ok:true,config});}catch(err){console.error('studio_save',err);return reply({error:'Falha ao salvar no Netlify Blobs.'},502);}
 }
 if(data?.action==='upload'){
  const raw=safe(data.data,1800000),m=raw.match(/^data:image\/(png|jpeg|webp);base64,([a-zA-Z0-9+/=]+)$/);
  if(!m)return reply({error:'Envie PNG, JPG ou WebP com menos de 1 MB.'},400);
  const bytes=Buffer.from(m[2],'base64');if(bytes.length>1000000)return reply({error:'A imagem deve ter menos de 1 MB.'},413);
  const id='art-'+crypto.randomUUID();const mime='image/'+m[1];
  try{await getStore('lunaria-v2-media').set(id,bytes,{metadata:{mime}});return reply({ok:true,url:`/.netlify/functions/media?id=${id}`});}catch(err){console.error('studio_upload',err);return reply({error:'Falha ao enviar a imagem.'},502);}
 }
 return reply({error:'Ação desconhecida.'},400);
}
