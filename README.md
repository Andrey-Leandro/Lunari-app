# Lunaria 2.0 — História viva + Avatar + Lunaria Studio

**Projeto para GitHub + Netlify**. Aproveita a versão anterior e sua conexão via Netlify AI Gateway. **Mantenha um backup** das conversas antes de publicar.

## O que esta versão já implementa

- **Webnovela interativa como padrão:** capítulos iniciais específicos, narração e falas em blocos diferentes, continuidade da história (cenário, tempo, laços e conflitos).
- **IA online:** conversa real através das Netlify Functions e AI Gateway, com seu `APP_ACCESS_CODE` existente. Também existe modo demonstrativo local, claramente identificado.
- **Emoções:** afeição, interesse e intensidade que podem mudar conforme as respostas geradas pela IA, com valores salvos no aparelho. São indicadores narrativos experimentais, não estados psicológicos reais.
- **Avatar 2D editável:** cabelo, cor do cabelo, olhos, pele, vestuário, acessórios. Perfil de nome, pronomes, características e gostos usado como contexto das conversas.
- **Personagens dinâmicos:** 10 personagens existentes + criação de personagens no Lunaria Studio (nome, mundo, história, personalidade, foto e cena inicial). Atualizações feitas no Studio são verificadas pelo app a cada 14 segundos, sem precisar reenviar o ZIP.
- **Gerenciar fotos:** upload de JPG/PNG/WebP no Studio, com otimização antes do envio; imagem armazenada no Netlify Blobs. Também permite HTTPS externo.
- **Gerar imagens:** botão no perfil (versão anterior), pedido de imagem pela conversa e imagens ocasionais somente quando a pessoa optar por isso. Depende de modelo de imagens compatível e créditos da IA; não está garantido em todos os provedores.
- **Tema claro e escuro**, estilos minimalistas, PWA instalável pelo Chrome e galeria local. **Removemos os controles e funções de áudio do app**.
- **Separação de dados:** histórico das conversas e perfil pessoal permanecem no navegador da pessoa. O administrador não tem painel de leitura de conversas privadas.

## O que ainda NÃO é a V2 final

- Vídeos gerados por IA (ainda não implementados).
- Sincronização de mensagens privadas / avatar entre aparelhos (cada aparelho tem seu próprio armazenamento; exporte backups).
- Editor de avatar com milhares de peças ou arte realista 3D. A prévia atual é ilustrada em camadas SVG.
- Verificação documental de idade, autenticação de múltiplas contas ou infraestrutura antiabuso de escala comercial.
- Conteúdo sexual explícito. O modo íntimo é romance maduro e sensualidade sugerida entre adultos.
- Fidelidade visual perfeita de fotos geradas em sequência, ou garantia de que o AI Gateway disponibilize a API de imagens para seu plano.

## 1 — Atualizar a versão publicada

1. No Lunaria atual, entre em **Ajustes → Exportar conversas** e salve os backups nos aparelhos de cada pessoa.
2. Extraia o ZIP da V2 no notebook.
3. No **GitHub Desktop**, abra o repositório **`Lunari-app`** → **Show in Explorer**.
4. **Copie as pastas** `public`, `src`, `netlify` e os **arquivos** `netlify.toml`, `package.json`, `tsconfig.json` da pasta extraída para dentro do clone, substituindo quando solicitado. **Não copie a pasta `.git` de outro repositório nem apague o clone.**
5. No GitHub Desktop: escreva `Lunaria 2.0 — avatar, studio e narrativa` em Summary → **Commit to main** → **Push origin**.
6. No Netlify → **Deploys** confirme `Published`. Caso haja falha, abra os **Deploy logs**. A publicação instalará `@netlify/blobs` e compilará o TypeScript pelo comando `npm run build`.

## 2 — Configurar Studio (uma vez)

No Netlify → projeto **lunariapp** → **Project configuration → Environment variables**:

| Key | Value | Observação |
| --- | --- | --- |
| `APP_ACCESS_CODE` | código privado já configurado | **Não altere** se a IA já estiver funcionando |
| `ADMIN_ACCESS_CODE` | **outro código aleatório de 20+ caracteres** | Exclusivo do painel administrativo, nunca publique no GitHub |

Marque **Contains secret values** para `ADMIN_ACCESS_CODE`, escolha **All scopes** / **Functions** e reimplante após criar a variável. Mantenha `OPENAI_*` conforme estiver configurado pela sua conta do Netlify AI Gateway.

Abra **`https://lunariapp.netlify.app/studio.html`**, digite apenas ali `ADMIN_ACCESS_CODE` e clique em **Entrar no Studio**. Selecione um personagem, edite e clique em **Salvar edição → Publicar mudanças**. A outra pessoa receberá atualizações em ~14 segundos (rede e cache podem atrasar).

**Importante:** a senha administrativa é independente da senha de acesso à IA e não deve ser compartilhada. O Studio não fornece acesso a mensagens pessoais de outros aparelhos.

## 3 — Ativar avatar pessoal

No aplicativo, clique em **Meu avatar** na barra superior. Configure nome, características físicas e história pessoal, depois **Salvar avatar e identidade**. Esses dados são armazenados localmente e utilizados nas mensagens para a IA lembrar como é a protagonista.

## 4 — Imagens por IA

Dentro de um chat com IA conectada, escreva algo como **“Você pode me mandar uma foto sua nesta cena?”**. Após a resposta, o app solicita uma imagem ilustrativa e salva na galeria local se o serviço de imagens responder. Você também pode clicar em **Gerar retrato com IA** no perfil. Ative em Meu avatar as **fotos espontâneas** apenas se concordar com o eventual consumo de créditos. Caso não funcione, verifique o erro mostrado no app e os **Function logs** no Netlify; não prometemos disponibilidade de imagem em qualquer Gateway.

## 5 — Instalar como aplicativo no Android

No **Chrome para Android**, entre em `https://lunariapp.netlify.app` → ⋮ → **Instalar aplicativo** (ou **Adicionar à tela inicial**). É um **PWA**, não um APK nativo. Reabra após uma nova publicação para receber atualização; em casos de cache persistente, feche completamente e abra de novo.

## Segurança e privacidade

- Se o repositório estiver público, jamais inclua senhas, chaves ou arquivos `.env` no GitHub.
- O acesso administrativo usa código secreto verificado no servidor; é **adequado para prototipagem privada, não autenticação multiusuário profissional**. Antes de abrir ao público, configure rate limiting, contas autenticadas, recuperação de senha, monitoramento de abuso e políticas de privacidade.
- Personagens famosos são referências **de fãs**, sem licença comercial; para vender o aplicativo, obtenha licenças ou substitua por personagens originais.
- As conversas privadas ficam **somente no navegador**, não no Netlify Blobs. Apagar dados do navegador poderá apagá-las. Use Exportar conversas.
- O Netlify Blobs armazena **somente configurações publicadas e avatares de catálogo enviados pelo administrador**. O Studio é consultado pelo app a cada ~14s; não é websocket de tempo real.
- A IA real e imagens exigem internet e consomem créditos do provedor; não significa uso infinito gratuito.

## Arquitetura

```text
public/
  index.html, style.css, app.js, v2.js, v2.css
  studio.html, studio.js, studio.css
  assets/, manifest.webmanifest, sw.js, icon-*.png
src/app.ts
netlify/functions/
  chat.mjs, status.mjs, image.mjs
  studio.mjs, media.mjs
netlify.toml, package.json, tsconfig.json
```

A interface do Studio e do app é HTML/CSS/JavaScript. O backend do Studio usa `@netlify/blobs` para dados compartilhados. As operações de edição exigem a variável privada `ADMIN_ACCESS_CODE` e as Functions do Netlify.
