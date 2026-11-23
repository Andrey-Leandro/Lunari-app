"use strict";
const $ = (selector) => document.querySelector(selector);
const icon = (name) => `<svg aria-hidden="true"><use href="#ic-${name}"/></svg>`;
const assets = (name) => `/assets/${name}.webp`;
const baseChars = [
    { id: 'yone', name: 'Yone', origin: 'League of Legends', category: 'jogos', age: 27, image: assets('yone'), personality: 'Disciplinado, introspectivo, honrado, gentil de forma discreta. Pensativo, observador, cuidadoso com palavras.', story: 'Espadachim que carrega as memórias de suas batalhas. Nesta história alternativa, ele é adulto e encontra paz em pequenas conversas.', tags: ['Reservado', 'Leal', 'Protetor'], intro: 'O silêncio é diferente quando você está por perto. Quer me contar o que trouxe você até aqui?' },
    { id: 'sasuke', name: 'Sasuke (adulto)', origin: 'Naruto', category: 'animes', age: 32, image: assets('sasuke'), personality: 'Reservado, independente, irônico em doses discretas, intenso, leal e difícil de impressionar.', story: 'Universo alternativo com a versão inequivocamente adulta do personagem. Percorre o mundo tentando compreender seus próprios sentimentos.', tags: ['Misterioso', 'Intenso', 'Calado'], intro: 'Você sempre chega sem fazer barulho? ... Acho que vou ter que me acostumar com isso.' },
    { id: 'gojo', name: 'Satoru Gojo', origin: 'Jujutsu Kaisen', category: 'animes', age: 29, image: assets('gojo'), personality: 'Brincalhão, espirituoso, provocador, confiante, com lado afetuoso inesperado.', story: 'Professor adulto que esconde preocupações sob piadas e confiança.', tags: ['Engraçado', 'Confiante', 'Provocador'], intro: 'Olha só quem apareceu! Estava quase achando que teria que usar meus poderes para te encontrar. Brincadeira... talvez.' },
    { id: 'castiel', name: 'Castiel (adulto)', origin: 'Amor Doce · Love Life', category: 'amor-doce', age: 24, image: assets('castiel'), personality: 'Sarcástico, rebelde, músico, direto, provocador, romântico sem admitir facilmente.', story: 'Versão adulta em um universo alternativo, vivendo de música, shows e conversas até tarde da noite.', tags: ['Rockeiro', 'Sarcástico', 'Intenso'], intro: 'Demorou, hein? Achei que tinha me deixado falando sozinho. ... Não que eu estivesse esperando.' },
    { id: 'nathaniel', name: 'Nathaniel (adulto)', origin: 'Amor Doce · Love Life', category: 'amor-doce', age: 25, image: assets('nathaniel'), personality: 'Atencioso, inteligente, responsável, gentil, um pouco reservado e observador.', story: 'Versão adulta, equilibrando trabalho e descobertas pessoais.', tags: ['Gentil', 'Inteligente', 'Atencioso'], intro: 'Oi, você chegou. Estava lendo, mas confesso que uma conversa sua parece bem mais interessante.' },
    { id: 'lysandre', name: 'Lysandre (adulto)', origin: 'Amor Doce', category: 'amor-doce', age: 26, image: assets('lysandre'), personality: 'Poético, delicado, sonhador, músico e curioso sobre as emoções humanas.', story: 'Versão adulta, compositor que encontra inspiração em lugares tranquilos.', tags: ['Poético', 'Romântico', 'Calmo'], intro: 'Engraçado... às vezes uma presença muda completamente o ritmo de uma tarde. A sua fez isso agora.' },
    { id: 'kayn', name: 'Kayn', origin: 'League of Legends', category: 'jogos', age: 26, image: assets('kayn'), personality: 'Ousado, competitivo, sarcástico, orgulhoso e imprevisível, com sensibilidade escondida.', story: 'Guerreiro adulto em um cenário fictício alternativo cheio de segredos.', tags: ['Rebelde', 'Confiante', 'Impulsivo'], intro: 'Você parece ter algo interessante para dizer. Então me surpreenda.' },
    { id: 'levi', name: 'Levi Ackerman', origin: 'Attack on Titan', category: 'animes', age: 34, image: assets('levi'), personality: 'Direto, organizado, protetor nos gestos, humor seco, raramente demonstra sentimentos abertamente.', story: 'Soldado adulto em uma realidade alternativa de reconstrução e calmaria.', tags: ['Sério', 'Leal', 'Observador'], intro: 'Você chegou. Tem chá na mesa. Sente-se antes que esfrie.' },
    { id: 'zoro', name: 'Roronoa Zoro', origin: 'One Piece', category: 'animes', age: 22, image: assets('zoro'), personality: 'Determinado, orgulhoso, leal, engraçado sem perceber, sempre se perde pelo caminho.', story: 'Espadachim adulto, entre aventuras e novas amizades.', tags: ['Leal', 'Corajoso', 'Distraído'], intro: 'Tsc... Acho que me perdi de novo. Já que você está aqui, sabe como chegar ao porto?' },
    { id: 'sylus', name: 'Sylus', origin: 'Love and Deepspace', category: 'jogos', age: 28, image: assets('sylus'), personality: 'Elegante, seguro de si, irônico, carismático e atento aos detalhes.', story: 'Personagem adulto em uma cidade futurista e cheia de mistérios.', tags: ['Elegante', 'Misterioso', 'Sedutor'], intro: 'Finalmente nos encontramos. Tenho a impressão de que esta noite vai ser mais interessante do que eu planejava.' }
];
const STORAGE = 'lunaria_state_v1';
const ACCESS = 'lunaria_access_session';
const accessCode = () => sessionStorage.getItem(ACCESS) || '';
const initial = () => ({ characters: baseChars, favorites: [], messages: {}, affinity: {}, modes: {}, selected: '', theme: 'light', adult: false, name: '', gallery: [] });
function load() { try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (!raw || typeof raw !== 'object')
        return initial();
    const fresh = initial();
    return { ...fresh, ...raw, characters: [...baseChars, ...(Array.isArray(raw.characters) ? raw.characters.filter((c) => c.custom && c.age >= 18) : [])], favorites: Array.isArray(raw.favorites) ? raw.favorites : [], messages: raw.messages && typeof raw.messages === 'object' ? raw.messages : {}, gallery: Array.isArray(raw.gallery) ? raw.gallery : [] };
}
catch {
    return initial();
} }
let state = load();
let activeFilter = 'todos';
let activePage = 'home';
let searchText = '';
let aiReady = false;
let busy = false;
let toastTimeout;
let pending = null;
let modalName = '';
let profileOpen = false;
const persist = () => { try {
    localStorage.setItem(STORAGE, JSON.stringify(state));
}
catch {
    toast('Armazenamento cheio. Exporte seus dados e remova mídias antigas.');
} };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] || c));
const getChar = (id = state.selected) => { if (id.startsWith('group::')) {
    const ids = id.slice(7).split('::');
    const chars = ids.map(v => state.characters.find(c => c.id === v)).filter(Boolean);
    if (chars.length === 2)
        return { id, name: `${chars[0].name} & ${chars[1].name}`, origin: 'Encontro em grupo', category: 'originais', age: 18, image: chars[0].image, personality: chars.map(c => `${c.name}: ${c.personality}`).join(' | '), story: `Os dois personagens participam de uma conversa em grupo. ${chars.map(c => c.story).join(' ')}`, tags: ['Grupo', 'História'], intro: `${chars[0].name}: Parece que não estamos sozinhos por aqui.\n\n${chars[1].name}: Uma conversa a três? Isso pode ser interessante.` };
} return state.characters.find(c => c.id === id); };
const getMessages = (id = state.selected) => { if (!state.messages[id])
    state.messages[id] = []; return state.messages[id]; };
const newId = () => `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = window.setTimeout(() => el.classList.remove('show'), 3300); }
function renderTheme() { document.documentElement.dataset.theme = state.theme; document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'light' ? '#f8f6f3' : '#221f21'); }
function renderNav() { document.querySelectorAll('[data-action="home"],[data-action="chats"],[data-action="favorites"],[data-action="groups"]').forEach(b => b.classList.toggle('active', b.dataset.action === activePage)); document.querySelectorAll('.bottom-nav [data-action]').forEach(b => b.classList.toggle('selected', b.dataset.action === activePage)); }
function renderList() {
    const grid = $('#character-grid');
    grid.replaceChildren();
    let list = state.characters.filter(c => c.age >= 18);
    if (activePage === 'favorites')
        list = list.filter(c => state.favorites.includes(c.id));
    if (activePage === 'chats')
        list = list.filter(c => Boolean(state.messages[c.id]?.length));
    if (activeFilter !== 'todos' && activePage === 'home')
        list = list.filter(c => c.category === activeFilter);
    if (searchText)
        list = list.filter(c => `${c.name} ${c.origin} ${c.tags.join(' ')}`.toLowerCase().includes(searchText));
    $('#count-label').textContent = `${list.length} ${list.length === 1 ? 'personagem' : 'personagens'}`;
    if (!list.length) {
        const el = document.createElement('div');
        el.className = 'empty-state';
        el.style.gridColumn = '1/-1';
        el.innerHTML = '<span class="flower">✿</span>Nenhum personagem nesta lista.<br/>Tente outra busca ou crie o seu.';
        grid.append(el);
        return;
    }
    for (const c of list) {
        const card = document.createElement('div');
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.className = `character-card${state.selected === c.id ? ' selected' : ''}`;
        card.dataset.character = c.id;
        card.setAttribute('aria-label', `Conversar com ${c.name}`);
        card.innerHTML = `<div class="character-visual"><img loading="lazy" alt="Ilustração de ${escapeHtml(c.name)}" src="${escapeHtml(c.image)}"/><span class="adult-badge">18+</span></div><div class="character-meta"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.origin)}</span></div>`;
        const fav = document.createElement('button');
        fav.type = 'button';
        fav.className = `favorite-bubble ${state.favorites.includes(c.id) ? 'loved' : ''}`;
        fav.dataset.favorite = c.id;
        fav.title = 'Favoritar';
        fav.setAttribute('aria-label', `Favoritar ${c.name}`);
        fav.innerHTML = icon('heart');
        card.append(fav);
        grid.append(card);
    }
}
function renderScreen() { const isChat = Boolean(state.selected); $('#shell').classList.toggle('chat-open', isChat); $('#chat-empty').classList.toggle('hidden', isChat); $('#chat-active').classList.toggle('hidden', !isChat); $('#discover').classList.toggle('hidden', activePage === 'groups'); const titles = { home: 'Onde histórias começam.', favorites: 'Seus favoritos.', chats: 'Suas conversas.', groups: 'Encontros.' }; $('#page-title').textContent = titles[activePage] || titles.home; $('#filters').classList.toggle('hidden', activePage !== 'home'); const banner = $('.banner'); banner.classList.toggle('hidden', activePage !== 'home'); const head = $('.discover-head h2'); head.textContent = activePage === 'favorites' ? 'Personagens favoritos' : activePage === 'chats' ? 'Conversas recentes' : 'Encontre seu próximo capítulo'; $('#discover').classList.remove('hidden'); if (isChat)
    renderChat();
else
    closeProfile(); renderList(); renderNav(); }
function openChat(id) { if (!getChar(id))
    return; state.selected = id; activePage = 'home'; persist(); renderScreen(); setTimeout(() => $('#message-input').focus(), 70); }
function closeChat() { state.selected = ''; persist(); closeProfile(); renderScreen(); }
function renderChat() { const c = getChar(); if (!c)
    return; $('#chat-name').textContent = c.name; $('#chat-avatar').setAttribute('src', c.image); $('#chat-subtitle').textContent = `${c.origin} · Adulto · ${aiReady ? 'IA conectada' : 'Demonstração'}`; const mode = state.modes[c.id] || 'romance'; $('#mode-description').textContent = mode === 'story' ? '✦ Uma história em construção' : mode === 'intimate' ? '♡ Romance íntimo +18' : '✦ Romance espontâneo'; $('#toggle-story').classList.toggle('active', mode === 'story'); $('#toggle-intimate').classList.toggle('active', mode === 'intimate'); $('#chat-footnote').textContent = aiReady ? 'IA conectada por API. As mensagens enviadas são processadas pelo provedor configurado.' : 'Modo demonstração: respostas locais roteirizadas. IA real exige função Netlify + chave de API.'; renderMessages(); if (profileOpen)
    renderProfile(); }
function renderMessages() { const c = getChar(); if (!c)
    return; const list = $('#message-list'); list.replaceChildren(); const day = document.createElement('div'); day.className = 'day-separator'; day.textContent = 'Um novo capítulo'; list.append(day); let messages = getMessages(); if (!messages.length) {
    messages.push({ id: newId(), role: 'assistant', text: c.intro, time: Date.now(), speaker: c.name });
    persist();
} for (const m of messages) {
    const row = document.createElement('article');
    row.className = `message-row ${m.role}`;
    if (m.role !== 'system') {
        if (m.role === 'assistant') {
            const avatar = document.createElement('img');
            avatar.className = 'message-avatar';
            avatar.src = c.id.startsWith('group::') ? groupSpeakerImg(m.speaker, c) : c.image;
            avatar.alt = '';
            row.append(avatar);
        }
        const wrap = document.createElement('div');
        if (c.id.startsWith('group::') && m.role === 'assistant') {
            const name = document.createElement('div');
            name.className = 'message-name';
            name.textContent = m.speaker || c.name;
            wrap.append(name);
        }
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (m.text)
            bubble.textContent = m.text;
        wrap.append(bubble);
        if (m.imageId) {
            const im = document.createElement('img');
            im.className = 'message-image';
            im.alt = 'Imagem gerada por IA';
            bubble.prepend(im);
            loadBlobUrl(m.imageId).then(url => { if (url)
                im.src = url;
            else
                im.alt = 'Imagem indisponível neste dispositivo'; });
        }
        if (m.media) {
            const preview = document.createElement(m.media.type === 'video' ? 'video' : 'img');
            preview.className = m.media.type === 'video' ? 'message-video' : 'message-image';
            if (m.media.type === 'video') {
                preview.controls = true;
                preview.preload = 'metadata';
            }
            else
                preview.setAttribute('alt', m.media.name);
            bubble.prepend(preview);
            loadBlobUrl(m.media.id).then(url => { if (url)
                preview.src = url;
            else
                preview.replaceWith(document.createTextNode('Mídia indisponível neste dispositivo.')); });
        }
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date(m.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        wrap.append(time);
        row.append(wrap);
    }
    else {
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = m.text;
        row.append(bubble);
    }
    list.append(row);
} if (busy) {
    const row = document.createElement('div');
    row.className = 'message-row assistant';
    row.innerHTML = `<img class="message-avatar" src="${escapeHtml(c.image)}" alt=""/><div class="message-bubble typing" aria-label="Digitando"><i></i><i></i><i></i></div>`;
    list.append(row);
} scrollMessages(); }
function groupSpeakerImg(speaker, c) { if (!speaker)
    return c.image; const match = state.characters.find(v => v.name === speaker); return match?.image || c.image; }
function scrollMessages() { requestAnimationFrame(() => { const el = $('#chat-scroll'); el.scrollTop = el.scrollHeight; }); }
function renderProfile() { const c = getChar(); if (!c)
    return; const box = $('#profile-content'); box.replaceChildren(); const cover = document.createElement('img'); cover.className = 'profile-cover'; cover.alt = `Retrato ${c.name}`; cover.src = c.image; box.append(cover); const detail = document.createElement('div'); detail.className = 'profile-details'; const isFav = state.favorites.includes(c.id); detail.innerHTML = `<h2>${escapeHtml(c.name)}</h2><div class="profile-origin">${escapeHtml(c.origin)} · ${c.age}+ anos</div><div class="tag-line">${c.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div><div class="profile-mini-heading">PERSONALIDADE</div><p>${escapeHtml(c.personality)}</p><div class="profile-mini-heading">SUA HISTÓRIA</div><p>${escapeHtml(c.story)}</p><div class="profile-mini-heading">AFINIDADE · ${Math.min(100, state.affinity[c.id] || 5)}%</div><div class="affinity"><div style="width:${Math.min(100, state.affinity[c.id] || 5)}%"></div></div><div class="profile-buttons"><button class="button button-primary full" data-action="generate">${icon('sparkle')} Gerar retrato com IA</button><button class="button button-secondary full" data-action="favoriteprofile">${icon('heart')} ${isFav ? 'Remover favorito' : 'Adicionar aos favoritos'}</button>${c.custom ? `<button class="button button-secondary full" data-action="editchar">${icon('edit')} Editar personagem</button>` : ''}</div><div class="field-note">Retratos e vozes de personagens são representações fictícias. Mídia generativa depende da disponibilidade de uma API compatível.</div>`; box.append(detail); }
function openProfile() { if (!state.selected)
    return; profileOpen = true; $('#profile-panel').classList.remove('hidden'); renderProfile(); }
function closeProfile() { profileOpen = false; $('#profile-panel').classList.add('hidden'); }
function switchMode(mode) { const c = getChar(); if (!c)
    return; if (mode === 'intimate' && !state.adult) {
    modalAdult();
    return;
} const next = state.modes[c.id] === mode ? 'romance' : mode; state.modes[c.id] = next; getMessages().push({ id: newId(), role: 'system', text: next === 'intimate' ? 'Modo íntimo para adultos ativado: romance e sensualidade consensuais, sem descrições sexuais explícitas.' : next === 'story' ? 'Modo história ativado: vocês podem construir uma aventura juntos.' : 'Modo romance ativado.', time: Date.now() }); persist(); renderChat(); }
function demoReply(c, txt, media, mode) {
    const t = txt.toLowerCase();
    const name = c.name.split(' ')[0];
    const n = getMessages().filter(m => m.role === 'user').length;
    const pick = (items) => items[n % items.length];
    let msg = '';
    if (media)
        msg = `Recebi sua mídia! 🌷 No modo demonstração eu ainda não consigo enxergar fotos ou vídeos; com a IA conectada, posso observar e comentar de verdade. Me conta o contexto?`;
    else if (/segredo|confess|sincer/.test(t))
        msg = pick([`Um segredo? Às vezes eu ensaio respostas antes de te escrever. Só não conta para ninguém.`, `Não costumo confiar meus pensamentos a muita gente. Mas com você é diferente.`, `Vou te contar algo: gosto quando uma conversa não precisa ter pressa.`]);
    else if (/dia|tudo bem|como está|como foi/.test(t))
        msg = pick([`Foi um daqueles dias longos. Mas sua mensagem melhorou a noite. E o seu?`, `Tive alguns pensamentos demais hoje. Você sabe como é... quer me contar do seu dia?`, `Foi tranquilo, na medida do possível. Estou mais curioso sobre você.`]);
    else if (/história|aventura|rpg|mundo|juntos/.test(t) || mode === 'story')
        msg = pick([`A chuva começa a cair quando chegamos à porta de uma biblioteca abandonada. Eu olho para você: “Abrimos a porta ou seguimos pela rua?”`, `Uma carta sem remetente aparece à nossa frente. O selo traz uma lua prateada. O que você faria?`, `Estamos numa estação vazia, pouco antes da meia-noite. De repente, alguém pronuncia nosso nome. Você vem comigo investigar?`]);
    else if (/amor|gost|saudad|beijo|carinho|românt|lindo|bonit/.test(t) || mode === 'intimate')
        msg = pick([`Você tem um jeito perigoso de me fazer sorrir sem perceber.`, `Acho que gosto quando você chega mais perto... mas devagar. Gosto do tempo que temos.`, `Se eu te dissesse que pensei em você hoje, você acreditaria?`]);
    else if (/piada|meme|engraç|kkkk|haha/.test(t))
        msg = pick([`KKKK. Você percebeu que conseguimos transformar qualquer conversa numa confusão?`, `Se você continuar assim, vou rir num momento completamente inadequado.`, `Humor de qualidade questionável. Admito que gostei. 😂`]);
    else if (/foto|selfie|imagem|vídeo/.test(t))
        msg = `Eu adoraria transformar esse momento em uma imagem. No modo demonstração, consigo conversar sobre a ideia; para gerar uma imagem nova, precisamos conectar a API.`;
    else
        msg = pick([`Você tem um jeito interessante de ver as coisas. Me conta mais, estou ouvindo.`, `Hmm... não esperava essa resposta. O que te fez pensar nisso?`, `Talvez eu devesse guardar essa conversa na memória. Gostei da forma como você disse isso.`, `Você consegue tornar até os assuntos simples mais interessantes. E agora, para onde levamos essa história?`, `Interessante... ${name} talvez não admitisse isso tão facilmente, mas adoro continuar essa conversa com você.`]);
    if (c.id === 'castiel' && !media && !/história|aventura|rpg/.test(t))
        msg = pick([`Tsc... tá tentando me fazer perder a pose, é? ${msg}`, `Olha, eu não faço elogios de graça... mas ${msg.toLowerCase()}`, msg]);
    if (c.id === 'gojo' && !media)
        msg = pick([`${msg} E sim, continuo sendo modestíssimo. 😎`, msg, `Opa, isso merece uma conversa séria! Ou quase séria. ${msg}`]);
    if (c.id === 'levi' && !media)
        msg = pick([msg, `Entendo. ${msg} ... E não esqueça de se cuidar.`]);
    let speaker = c.name;
    if (c.id.startsWith('group::')) {
        const ids = c.id.slice(7).split('::');
        speaker = (state.characters.find(v => v.id === ids[n % 2]) || c).name;
        msg = `${msg}`;
    }
    return { text: msg, speaker };
}
async function sendMessage(ev) {
    ev?.preventDefault();
    if (busy)
        return;
    const c = getChar();
    if (!c)
        return;
    const input = $('#message-input');
    const text = input.value.trim();
    if (!text && !pending)
        return;
    if (text.length > 2000) {
        toast('Máximo de 2.000 caracteres.');
        return;
    }
    const asset = pending;
    pending = null;
    let attachment;
    if (asset) {
        try {
            const id = newId();
            await dbSet(id, asset.file);
            attachment = { id, name: asset.file.name, type: asset.type, frames: asset.frames };
        }
        catch {
            toast('Não foi possível salvar a mídia neste navegador.');
        }
    }
    const userMessage = { id: newId(), role: 'user', text: text || (asset?.type === 'video' ? 'Enviei um vídeo. O que você acha?' : 'Enviei uma foto. O que você acha?'), time: Date.now(), media: attachment };
    getMessages().push(userMessage);
    state.affinity[c.id] = Math.min(100, (state.affinity[c.id] || 5) + 2);
    input.value = '';
    input.style.height = '';
    $('#attachment-preview').classList.add('hidden');
    persist();
    busy = true;
    $('#send-button').setAttribute('disabled', 'true');
    renderMessages();
    try {
        let reply;
        if (aiReady) {
            const history = getMessages().slice(-16).map(m => ({ role: m.role, text: m.text, speaker: m.speaker, frames: m.id === userMessage.id ? attachment?.frames : undefined }));
            const res = await fetch('/.netlify/functions/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-access-code': accessCode() }, body: JSON.stringify({ character: { name: c.name, age: c.age, personality: c.personality, story: c.story, intro: c.intro }, mode: state.modes[c.id] || 'romance', history, userName: state.name || 'Visitante', group: c.id.startsWith('group::') }) });
            const data = await res.json().catch(() => ({}));
            if (!res.ok)
                throw new Error(data?.error || 'A conexão com a IA falhou.');
            reply = { text: String(data.reply || '').trim(), speaker: data.speaker || c.name };
            if (!reply.text)
                throw new Error('A IA retornou uma resposta vazia.');
        }
        else {
            await new Promise(resolve => setTimeout(resolve, 620));
            reply = demoReply(c, text, Boolean(asset), state.modes[c.id] || 'romance');
        }
        getMessages().push({ id: newId(), role: 'assistant', text: reply.text.slice(0, 3500), time: Date.now(), speaker: reply.speaker });
        persist();
    }
    catch (err) {
        getMessages().push({ id: newId(), role: 'system', text: `Não foi possível responder: ${err instanceof Error ? err.message : 'erro desconhecido'}. Sua mensagem foi preservada.`, time: Date.now() });
        persist();
        toast('Não foi possível falar com a IA. Confira a configuração.');
    }
    finally {
        busy = false;
        $('#send-button').removeAttribute('disabled');
        renderMessages();
    }
}
function showAttachment() { const box = $('#attachment-preview'); box.replaceChildren(); if (!pending) {
    box.classList.add('hidden');
    return;
} box.classList.remove('hidden'); if (pending.preview) {
    const img = document.createElement('img');
    img.src = pending.preview;
    img.alt = 'Prévia do anexo';
    box.append(img);
} const p = document.createElement('span'); p.textContent = `${pending.type === 'image' ? 'Foto' : 'Vídeo'}: ${pending.file.name.slice(0, 38)}`; box.append(p); const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Remover ×'; btn.onclick = () => { pending = null; showAttachment(); }; box.append(btn); }
async function readAsDataUrl(file) { return new Promise((resolve, reject) => { const fr = new FileReader(); fr.onload = () => resolve(String(fr.result)); fr.onerror = reject; fr.readAsDataURL(file); }); }
async function resizeImage(file, maxW = 980) { const url = URL.createObjectURL(file); try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = url; });
    const scale = Math.min(1, maxW / img.naturalWidth, maxW / img.naturalHeight);
    const can = document.createElement('canvas');
    can.width = Math.max(1, Math.round(img.naturalWidth * scale));
    can.height = Math.max(1, Math.round(img.naturalHeight * scale));
    can.getContext('2d').drawImage(img, 0, 0, can.width, can.height);
    return can.toDataURL('image/jpeg', .68);
}
finally {
    URL.revokeObjectURL(url);
} }
async function videoFrames(file) { const url = URL.createObjectURL(file); const vid = document.createElement('video'); vid.muted = true; vid.preload = 'auto'; vid.playsInline = true; vid.src = url; try {
    await new Promise((resolve, reject) => { vid.onloadedmetadata = () => resolve(); vid.onerror = () => reject(new Error('Vídeo não compatível com este navegador.')); setTimeout(() => reject(new Error('Tempo limite ao ler vídeo.')), 12000); });
    const frames = [];
    for (const ratio of [.1, .55]) {
        const position = Number.isFinite(vid.duration) ? Math.max(0, Math.min(vid.duration - .05, vid.duration * ratio)) : 0;
        await new Promise((resolve, reject) => { vid.onseeked = () => resolve(); vid.onerror = () => reject(new Error('Falha ao ler quadro do vídeo.')); vid.currentTime = position; setTimeout(() => resolve(), 2500); });
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 700 / (vid.videoWidth || 700), 700 / (vid.videoHeight || 700));
        canvas.width = Math.round((vid.videoWidth || 600) * scale);
        canvas.height = Math.round((vid.videoHeight || 400) * scale);
        canvas.getContext('2d')?.drawImage(vid, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg', .62));
    }
    return frames;
}
finally {
    URL.revokeObjectURL(url);
    vid.removeAttribute('src');
    vid.load();
} }
async function attachFile(file) { if (!file)
    return; if (busy)
    return; if (file.size > 16 * 1024 * 1024) {
    toast('Arquivo acima de 16 MB. Escolha um menor.');
    return;
} const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null; if (!type) {
    toast('Envie uma foto ou um vídeo compatível.');
    return;
} try {
    const frames = type === 'image' ? [await resizeImage(file)] : await videoFrames(file);
    pending = { file, type, frames, preview: frames[0] || '' };
    showAttachment();
    toast(type === 'video' ? 'Vídeo anexado: IA receberá quadros para análise.' : 'Foto anexada.');
}
catch (err) {
    toast('Não foi possível preparar a mídia. Tente JPG, PNG ou MP4.');
} }
function newModal(title, html, name) { modalName = name; $('#modal-title').textContent = title; $('#modal-body').innerHTML = html; $('#modal-layer').classList.remove('hidden'); }
function closeModal() { modalName = ''; $('#modal-layer').classList.add('hidden'); $('#modal-body').replaceChildren(); }
function modalAdult() { newModal('Um espaço para adultos', `<div class="notice-box"><strong>Modo íntimo +18</strong><br/>Permite histórias românticas maduras, flertes e sensualidade entre adultos, respeitando consentimento. Não inclui geração de conteúdo sexual explícito nem envolvendo menores. A confirmação abaixo é uma declaração de idade, não uma verificação documental.</div><label class="check-row"><input type="checkbox" id="adult-check"/><span>Confirmo que tenho 18 anos ou mais e compreendo as condições de uso.</span></label><div class="dialog-actions"><button class="button button-secondary" data-action="close">Agora não</button><button class="button button-primary" id="adult-confirm">Ativar modo adulto</button></div>`, 'adult'); }
function modalCreate(existing) { const edit = Boolean(existing); const sel = existing?.image || assets('yone'); const images = ['yone', 'sasuke', 'gojo', 'castiel', 'nathaniel', 'lysandre', 'kayn', 'levi', 'zoro', 'sylus']; newModal(edit ? 'Editar personagem' : 'Crie alguém único', `<form id="character-form"><div class="two-col"><div class="field"><label for="character-name">Nome *</label><input id="character-name" maxlength="42" required value="${escapeHtml(existing?.name || '')}" placeholder="Ex.: Kael"/></div><div class="field"><label for="character-age">Idade (18+)</label><input id="character-age" type="number" min="18" max="120" value="${existing?.age || 24}" required/></div></div><div class="field"><label for="character-origin">Universo / origem</label><input id="character-origin" maxlength="60" value="${escapeHtml(existing?.origin || 'Original')}" placeholder="Ex.: Cidade das Estrelas"/></div><div class="field"><label for="character-personality">Personalidade *</label><textarea id="character-personality" required minlength="12" maxlength="1400" placeholder="É alguém irônico, gentil, tímido, apaixonado por música...">${escapeHtml(existing?.personality || '')}</textarea></div><div class="field"><label for="character-story">Passado e universo</label><textarea id="character-story" maxlength="1600" placeholder="Conte como esse personagem vive e o que o torna único...">${escapeHtml(existing?.story || '')}</textarea></div><div class="field"><label for="character-intro">Primeira mensagem</label><textarea id="character-intro" maxlength="500" placeholder="Oi, achei que não viria hoje...">${escapeHtml(existing?.intro || '')}</textarea></div><div class="field"><span>Escolha uma ilustração de referência</span><div class="cover-picker" id="cover-picker">${images.map(v => `<button type="button" data-cover="${v}" class="${sel === assets(v) ? 'active' : ''}" aria-label="Usar imagem ${v}"><img src="${assets(v)}" alt="Retrato estilizado"/></button>`).join('')}</div><input type="hidden" id="character-image" value="${escapeHtml(sel)}"/></div><div class="notice-box">Todos os personagens criados para o modo romântico ou adulto devem ser inequivocamente maiores de 18 anos. Ilustrações predefinidas são referências visuais e não artes oficiais.</div><div class="dialog-actions"><button type="button" class="button button-secondary" data-action="close">Cancelar</button><button class="button button-primary" type="submit">${edit ? 'Salvar mudanças' : 'Criar personagem'}</button></div></form>`, 'create'); $('#character-form').addEventListener('submit', e => { e.preventDefault(); const get = (id) => ($(`#${id}`)?.value || '').trim(); const age = Number(get('character-age')); const name = get('character-name'); const personality = get('character-personality'); if (age < 18 || age > 120 || !Number.isFinite(age)) {
    toast('O personagem precisa ter pelo menos 18 anos.');
    return;
} if (!name || personality.length < 12) {
    toast('Informe um nome e uma personalidade com pelo menos 12 caracteres.');
    return;
} const c = { id: existing?.id || `custom_${Date.now()}`, name, age, origin: get('character-origin') || 'Original', category: 'originais', personality, story: get('character-story') || 'Uma história que vocês podem construir juntos.', tags: ['Original', 'Personalizado'], intro: get('character-intro') || `Olá... Eu sou ${name}. Que bom te conhecer.`, image: get('character-image') || assets('yone'), custom: true }; if (existing) {
    const ix = state.characters.findIndex(v => v.id === existing.id);
    if (ix >= 0)
        state.characters[ix] = c;
}
else
    state.characters.push(c); persist(); closeModal(); openChat(c.id); toast(edit ? 'Personagem atualizado.' : 'Seu personagem está pronto!'); }); }
function modalSettings() { newModal('Seu espaço', `<section class="settings-section"><h3>Aparência</h3><p>Um visual calmo para acompanhar suas histórias.</p><div class="row-buttons"><button class="button ${state.theme === 'light' ? 'button-primary' : 'button-secondary'}" data-action="light">${icon('sun')} Claro</button><button class="button ${state.theme === 'dark' ? 'button-primary' : 'button-secondary'}" data-action="dark">${icon('moon')} Escuro</button></div></section><section class="settings-section"><h3>Seu nome nas histórias</h3><div class="field"><input id="visitor-name" maxlength="30" placeholder="Como deseja ser chamada?" value="${escapeHtml(state.name)}"/></div><button class="button button-secondary" data-action="save-name">Salvar nome</button></section><section class="settings-section"><h3>Modo adulto</h3><p>${state.adult ? '♡ Ativado. Disponível nos chats, sem conteúdo sexual explícito.' : 'Desativado. Conteúdo romântico não explícito permanece disponível.'}</p><button class="button button-secondary" data-action="adult-toggle">${state.adult ? 'Desativar modo íntimo' : 'Ativar modo íntimo +18'}</button></section><section class="settings-section"><h3>Conexão com IA</h3><span class="settings-badge">${aiReady ? 'Conectada' : 'Demonstração local'}</span><div class="field" style="margin-top:12px"><label for="access-code">Código privado da IA (definido no Netlify)</label><input id="access-code" type="password" maxlength="128" placeholder="APP_ACCESS_CODE" value="${escapeHtml(accessCode())}"/></div><button class="button button-secondary" data-action="save-access">${icon('shield')} Conectar com código</button><p>${aiReady ? 'Respostas enviadas ao serviço configurado pelo responsável pelo site.' : 'O site funciona sem API com conversas roteirizadas. Para respostas de IA reais e geração de imagens, configure OPENAI_API_KEY nas variáveis do Netlify e publique a versão completa com Functions.'}</p><p>Uma assinatura ChatGPT não inclui automaticamente créditos para usar a API.</p></section><section class="settings-section"><h3>Privacidade e dados</h3><p>Conversas e ilustrações salvas neste navegador. Mídias enviadas ficam neste dispositivo; ao chamar a IA online, trechos de conversa e quadros de mídia são enviados para processamento. Não compartilhe dados sensíveis.</p><div class="row-buttons"><button class="button button-secondary" data-action="export">${icon('download')} Exportar conversas</button><label class="button button-secondary" for="import-file">${icon('upload')} Importar</label><input class="visually-hidden" type="file" id="import-file" accept="application/json"/><button class="button button-secondary" data-action="delete-all">${icon('trash')} Apagar tudo</button></div></section><div class="notice-box">Protótipo privado independente. Personagens conhecidos pertencem a seus titulares. Não há assinatura Premium, compra ou moedas neste protótipo.</div>`, 'settings'); }
function modalGallery() { newModal('Galeria de momentos', `<p class="field-note" style="margin-bottom:14px">Fotos geradas na sua conta ficam salvas no navegador deste aparelho. Gerar novas imagens exige uma API conectada e pode gerar cobranças.</p><div id="gallery-grid" class="gallery-grid"></div><div class="dialog-actions"><button class="button button-secondary" data-action="close">Fechar</button></div>`, 'gallery'); const grid = $('#gallery-grid'); if (!state.gallery.length) {
    grid.innerHTML = '<p class="empty-state" style="grid-column:1/-1"><span class="flower">✿</span>Ainda não há fotos geradas.<br/>Abra o perfil de um personagem para começar.</p>';
    return;
} for (const entry of state.gallery.slice().reverse()) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.alt = entry.caption;
    loadBlobUrl(entry.id).then(url => { if (url)
        img.src = url; });
    const label = document.createElement('small');
    label.textContent = entry.characterName;
    const btn = document.createElement('button');
    btn.textContent = 'Ver / salvar';
    btn.onclick = () => showGalleryImage(entry.id, entry.caption);
    item.append(img, label, btn);
    grid.append(item);
} }
async function showGalleryImage(id, caption) { const url = await loadBlobUrl(id); if (!url) {
    toast('Esta imagem não está disponível neste dispositivo.');
    return;
} newModal('Momento guardado', `<img id="generated-view" class="gallery-preview" alt="Imagem gerada"/><p class="field-note">${escapeHtml(caption)}</p><div class="dialog-actions"><button class="button button-secondary" data-action="gallery">Voltar</button><a class="button button-primary" id="save-generated" download="lunaria-retrato.png">Salvar imagem</a></div>`, 'imageview'); $('#generated-view').src = url; $('#save-generated').href = url; }
function modalGenerate() { const c = getChar(); if (!c)
    return; newModal('Criar um retrato', `<p class="field-note" style="margin-bottom:14px">Peça uma cena romântica ou um retrato do personagem. A imagem será gerada pelo serviço de IA configurado, sujeito aos limites do provedor.</p><div class="field"><label for="image-prompt">Descreva a cena</label><textarea id="image-prompt" maxlength="550">Retrato elegante e cinematográfico de ${escapeHtml(c.name)}, adulto, vestindo roupas casuais sofisticadas, em uma cafeteria acolhedora ao pôr do sol, luz suave, sorriso discreto, enquadramento vertical.</textarea></div><div class="notice-box">A geração pode ter custo na API. As imagens são ficcionais, não são imagens oficiais. Geração de pornografia explícita, menores ou imagens íntimas de pessoas reais sem consentimento não é disponibilizada.</div><div class="dialog-actions"><button class="button button-secondary" data-action="close">Cancelar</button><button id="generate-confirm" class="button button-primary">${icon('sparkle')} Gerar imagem</button></div>`, 'generate'); }
async function generateImage() { if (!aiReady) {
    toast('Conecte a API no Netlify para gerar novas imagens.');
    return;
} const c = getChar(); if (!c)
    return; const prompt = $('#image-prompt').value.trim(); if (prompt.length < 10) {
    toast('Descreva a imagem com mais detalhes.');
    return;
} const btn = $('#generate-confirm'); btn.disabled = true; btn.textContent = 'Gerando retrato...'; try {
    const res = await fetch('/.netlify/functions/image', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-access-code': accessCode() }, body: JSON.stringify({ name: c.name, age: c.age, personality: c.personality, appearance: c.story, scene: prompt }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.base64)
        throw new Error(data?.error || 'Não foi possível gerar a imagem.');
    const binary = atob(data.base64);
    const buf = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++)
        buf[i] = binary.charCodeAt(i);
    const blob = new Blob([buf], { type: data.mime || 'image/png' });
    const id = newId();
    await dbSet(id, blob);
    state.gallery.push({ id, characterId: c.id, characterName: c.name, caption: prompt, created: Date.now() });
    getMessages().push({ id: newId(), role: 'assistant', text: 'Preparei uma imagem para guardar este momento. ♡', time: Date.now(), imageId: id, speaker: c.name });
    persist();
    closeModal();
    renderChat();
    toast('Imagem gerada e salva na galeria!');
}
catch (err) {
    toast(err instanceof Error ? err.message : 'Falha ao gerar retrato.');
    btn.disabled = false;
    btn.textContent = 'Tentar novamente';
} }
function modalGroups() { const chars = state.characters.filter(c => c.age >= 18); newModal('Um encontro inesperado', `<p class="field-note" style="margin-bottom:15px">Coloque dois personagens adultos na mesma conversa. Na demonstração, eles alternam respostas; com IA conectada, o grupo ganha uma história compartilhada.</p><div class="two-col"><div class="field"><label for="group-a">Personagem 1</label><select id="group-a">${chars.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('')}</select></div><div class="field"><label for="group-b">Personagem 2</label><select id="group-b">${chars.map((c, i) => `<option value="${escapeHtml(c.id)}" ${i === 1 ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}</select></div></div><div class="notice-box">O grupo é uma simulação de diálogo entre personagens e não uma conexão com pessoas reais.</div><div class="dialog-actions"><button class="button button-secondary" data-action="close">Cancelar</button><button class="button button-primary" data-action="start-group">Criar encontro</button></div>`, 'groups'); }
function toggleFavorite(id) { if (state.favorites.includes(id))
    state.favorites = state.favorites.filter(v => v !== id);
else
    state.favorites.push(id); persist(); renderList(); if (profileOpen)
    renderProfile(); }
function confirmDelete(whole = false) { newModal(whole ? 'Apagar todos os dados?' : 'Limpar esta conversa?', `<div class="notice-box"><strong>Essa ação não pode ser desfeita.</strong><br/>${whole ? 'Todas as conversas, favoritos, personagens personalizados e imagens deste navegador serão apagados.' : 'As mensagens desta conversa serão removidas deste navegador. Seus personagens e favoritos permanecem.'}</div><div class="dialog-actions"><button class="button button-secondary" data-action="close">Cancelar</button><button class="button button-primary" data-action="confirm-delete" data-whole="${whole}">Sim, apagar</button></div>`, 'delete'); }
function exportData() { const safe = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2); const blob = new Blob([safe], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lunaria-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000); toast('Backup de conversas exportado. Mídias não acompanham este JSON.'); }
async function importData(file) { if (!file)
    return; try {
    if (file.size > 3 * 1024 * 1024)
        throw Error('Backup grande demais.');
    const data = JSON.parse(await file.text());
    const parsed = data?.data;
    if (!parsed || !Array.isArray(parsed.characters) || typeof parsed.messages !== 'object')
        throw Error('Backup inválido.');
    const adults = parsed.characters.filter((c) => c.custom && c.age >= 18 && typeof c.name === 'string');
    state = { ...initial(), ...parsed, characters: [...baseChars, ...adults], selected: '', favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [], gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [] };
    persist();
    closeModal();
    renderTheme();
    renderScreen();
    toast('Backup restaurado. Imagens antigas podem depender do dispositivo original.');
}
catch (err) {
    toast(err instanceof Error ? err.message : 'Não foi possível importar.');
} }
function dictateMessage() { const w = window; const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition; if (!SpeechRecognition) {
    toast('Ditado não disponível neste navegador.');
    return;
} const rec = new SpeechRecognition(); rec.lang = 'pt-BR'; rec.interimResults = false; rec.maxAlternatives = 1; rec.onresult = (event) => { const result = event.results?.[0]?.[0]?.transcript || ''; const field = $('#message-input'); field.value = (field.value ? field.value + ' ' : '') + result; field.focus(); }; rec.onerror = () => toast('Não foi possível captar a voz. Verifique o microfone.'); rec.start(); toast('Ouvindo... fale sua mensagem.'); }
function speakLast() { const c = getChar(); if (!c)
    return; const last = getMessages().filter(m => m.role === 'assistant').slice(-1)[0]; if (!last) {
    toast('Nenhuma resposta para ouvir.');
    return;
} if (!('speechSynthesis' in window)) {
    toast('Leitura de voz indisponível neste navegador.');
    return;
} window.speechSynthesis.cancel(); const utter = new SpeechSynthesisUtterance(last.text); utter.lang = 'pt-BR'; utter.rate = .94; utter.pitch = c.id === 'castiel' ? .8 : 1; window.speechSynthesis.speak(utter); toast('Reproduzindo em voz do dispositivo (não clonada).'); }
function showChatMenu() { newModal('Opções da conversa', `<div class="row-buttons"><button class="button button-secondary" data-action="profile">${icon('user')} Abrir perfil</button><button class="button button-secondary" data-action="chat-export">${icon('download')} Exportar diálogo</button><button class="button button-secondary" data-action="clear-chat">${icon('trash')} Limpar conversa</button></div><div class="notice-box">As conversas ficam salvas neste navegador. Se você limpar os dados do dispositivo, perderá mensagens sem backup.</div>`, 'chatmenu'); }
function exportChat() { const c = getChar(); if (!c)
    return; const text = getMessages().map(m => `[${new Date(m.time).toLocaleString('pt-BR')}] ${m.role === 'user' ? 'Você' : m.role === 'system' ? 'Sistema' : m.speaker || c.name}: ${m.text}`).join('\n\n'); const blob = new Blob([text], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lunaria-${c.id}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000); }
async function detectAI() { try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch('/.netlify/functions/status', { signal: ctrl.signal, cache: 'no-store', headers: { 'x-access-code': accessCode() } });
    clearTimeout(timeout);
    if (r.ok) {
        const obj = await r.json();
        aiReady = obj?.authorized === true;
    }
}
catch {
    aiReady = false;
} const chip = $('#connection-chip'); chip.classList.toggle('connected', aiReady); chip.innerHTML = `<span class="status-dot"></span> ${aiReady ? 'IA conectada' : 'Modo demonstração'}`; if (state.selected)
    renderChat(); }
let dbPromise;
function db() { if (!dbPromise)
    dbPromise = new Promise((resolve, reject) => { const request = indexedDB.open('lunaria_media_v1', 1); request.onupgradeneeded = () => { const d = request.result; if (!d.objectStoreNames.contains('media'))
        d.createObjectStore('media'); }; request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); return dbPromise; }
async function dbSet(id, blob) { const d = await db(); return new Promise((resolve, reject) => { const t = d.transaction('media', 'readwrite'); t.objectStore('media').put(blob, id); t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); }); }
async function dbGet(id) { try {
    const d = await db();
    return await new Promise((resolve, reject) => { const t = d.transaction('media', 'readonly'); const req = t.objectStore('media').get(id); req.onsuccess = () => resolve(req.result || null); req.onerror = () => reject(req.error); });
}
catch {
    return null;
} }
async function loadBlobUrl(id) { const blob = await dbGet(id); return blob ? URL.createObjectURL(blob) : null; }
async function dbClear() { try {
    const d = await db();
    await new Promise((resolve, reject) => { const t = d.transaction('media', 'readwrite'); t.objectStore('media').clear(); t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); });
}
catch { } }
function navigate(action) { if (action === 'home') {
    activePage = 'home';
    state.selected = '';
    searchText = '';
    ($('#search')).value = '';
    closeModal();
    closeProfile();
    renderScreen();
}
else if (action === 'chats' || action === 'favorites') {
    activePage = action;
    state.selected = '';
    closeModal();
    closeProfile();
    renderScreen();
}
else if (action === 'create') {
    modalCreate();
}
else if (action === 'groups') {
    modalGroups();
}
else if (action === 'gallery') {
    modalGallery();
}
else if (action === 'settings') {
    modalSettings();
}
else if (action === 'back') {
    closeChat();
}
else if (action === 'profile') {
    closeModal();
    openProfile();
}
else if (action === 'profileclose') {
    closeProfile();
}
else if (action === 'story') {
    switchMode('story');
}
else if (action === 'intimate') {
    switchMode('intimate');
}
else if (action === 'adult-toggle') {
    if (state.adult) {
        state.adult = false;
        for (const key of Object.keys(state.modes))
            if (state.modes[key] === 'intimate')
                state.modes[key] = 'romance';
        persist();
        modalSettings();
        renderChat();
        toast('Modo íntimo desativado.');
    }
    else
        modalAdult();
}
else if (action === 'speech') {
    speakLast();
}
else if (action === 'dictate') {
    dictateMessage();
}
else if (action === 'generate') {
    modalGenerate();
}
else if (action === 'chatmenu') {
    showChatMenu();
}
else if (action === 'light' || action === 'dark') {
    state.theme = action;
    persist();
    renderTheme();
    modalSettings();
}
else if (action === 'favoriteprofile') {
    toggleFavorite(state.selected);
}
else if (action === 'editchar') {
    const c = getChar();
    if (c?.custom)
        modalCreate(c);
}
else if (action === 'save-access') {
    const code = $('#access-code').value.trim();
    if (code)
        sessionStorage.setItem(ACCESS, code);
    else
        sessionStorage.removeItem(ACCESS);
    detectAI().then(() => { modalSettings(); toast(aiReady ? 'IA conectada!' : 'Código não autorizado ou Functions indisponíveis.'); });
}
else if (action === 'save-name') {
    state.name = $('#visitor-name').value.slice(0, 30).trim();
    persist();
    toast('Nome salvo.');
}
else if (action === 'export') {
    exportData();
}
else if (action === 'delete-all') {
    confirmDelete(true);
}
else if (action === 'clear-chat') {
    confirmDelete(false);
}
else if (action === 'chat-export') {
    exportChat();
    toast('Conversa exportada.');
}
else if (action === 'start-group') {
    const a = $('#group-a').value;
    const b = $('#group-b').value;
    if (a === b) {
        toast('Escolha dois personagens diferentes.');
        return;
    }
    closeModal();
    openChat(`group::${a}::${b}`);
}
else if (action === 'confirm-delete') {
    const whole = $('[data-action="confirm-delete"]').dataset.whole === 'true';
    if (whole) {
        localStorage.removeItem(STORAGE);
        state = initial();
        dbClear();
        renderTheme();
    }
    else
        delete state.messages[state.selected];
    closeModal();
    renderScreen();
    toast('Dados apagados.');
}
else if (action === 'close') {
    closeModal();
} }
function listen() { document.addEventListener('click', e => { const target = e.target; const cover = target.closest('[data-cover]'); if (cover) {
    document.querySelectorAll('[data-cover]').forEach(x => x.classList.remove('active'));
    cover.classList.add('active');
    $('#character-image').value = assets(cover.dataset.cover || 'yone');
    return;
} const fav = target.closest('[data-favorite]'); if (fav) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(fav.dataset.favorite || '');
    return;
} const el = target.closest('[data-character]'); if (el) {
    openChat(el.dataset.character || '');
    return;
} const filter = target.closest('[data-filter]'); if (filter) {
    activeFilter = filter.dataset.filter || 'todos';
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('selected', b === filter));
    renderList();
    return;
} const prompt = target.closest('[data-prompt]'); if (prompt) {
    $('#message-input').value = prompt.dataset.prompt || '';
    $('#message-input').focus();
    return;
} const action = target.closest('[data-action]'); if (action) {
    e.preventDefault();
    navigate(action.dataset.action || '');
} }); $('#composer').addEventListener('submit', sendMessage); $('#search').addEventListener('input', e => { searchText = e.target.value.trim().toLowerCase(); renderList(); }); $('#media-input').addEventListener('change', async (e) => { await attachFile(e.target.files?.[0]); e.target.value = ''; }); $('#message-input').addEventListener('keydown', e => { const event = e; if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
} }); $('#message-input').addEventListener('input', () => { const box = $('#message-input'); box.style.height = 'auto'; box.style.height = Math.min(box.scrollHeight, 115) + 'px'; }); $('#modal-body').addEventListener('click', async (e) => { const t = e.target; if (t.closest('#adult-confirm')) {
    if (!$('#adult-check')?.checked) {
        toast('Confirme que você tem pelo menos 18 anos.');
        return;
    }
    state.adult = true;
    persist();
    closeModal();
    if (state.selected)
        switchMode('intimate');
    toast('Modo íntimo habilitado.');
}
else if (t.closest('#generate-confirm'))
    await generateImage(); }); $('#modal-body').addEventListener('change', e => { const el = e.target; if (el.id === 'import-file')
    importData(el.files?.[0]); }); document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalName)
    closeModal(); const t = e.target; if ((e.key === 'Enter' || e.key === ' ') && t.matches('[data-character]')) {
    e.preventDefault();
    openChat(t.dataset.character || '');
} }); }
function init() { renderTheme(); listen(); state.selected = ''; renderScreen(); detectAI(); if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => { }));
} }
init();
