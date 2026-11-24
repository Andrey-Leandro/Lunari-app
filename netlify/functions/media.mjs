import {getStore} from '@netlify/blobs';
export default async function handler(request){
 if(request.method!=='GET')return new Response('Método não permitido',{status:405});
 const id=new URL(request.url).searchParams.get('id')||'';
 if(!/^art-[0-9a-f-]{36}$/.test(id))return new Response('Imagem inválida.',{status:400});
 try{const media=await getStore('lunaria-v2-media').getWithMetadata(id,{type:'arrayBuffer'});
 if(!media?.data)return new Response('Imagem não encontrada.',{status:404});
 const mime=media.metadata?.mime||'image/webp';
 return new Response(media.data,{headers:{'Content-Type':['image/png','image/jpeg','image/webp'].includes(mime)?mime:'image/webp','Cache-Control':'public, max-age=120','X-Content-Type-Options':'nosniff'}});
 }catch(err){console.error('studio_media',err);return new Response('Erro ao carregar imagem.',{status:502});}
}
