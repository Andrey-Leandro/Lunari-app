# Lunaria v1 — histórias que florescem

Primeira versão de um aplicativo PWA de personagens e histórias, com interface creme/rosa queimado e modo escuro. Projeto de demonstração para **uso privado de adultos**. O aplicativo **não é afiliado** a Naruto, League of Legends, Amor Doce, Jujutsu Kaisen, One Piece ou às demais franquias citadas; as imagens são ilustrações de fã e não materiais oficiais. Para distribuição comercial, substitua nomes e elementos protegidos por criações originais ou obtenha as licenças cabíveis.

## O que já funciona sem API

- Catálogo com 10 personagens **adultos**, filtros, busca e favoritos.
- Conversas locais com respostas **roteirizadas de demonstração**, e personalização de história/romance/modo íntimo (+18 com autodeclaração de idade; sem sexo explícito).
- Criação e edição de personagens originais, com personalidade, universo, idade, primeira fala e retrato.
- Afinidade, conversas em grupo demonstrativas, modo de RPG/histórias, modo claro/escuro.
- Gravação das conversas e perfis no navegador (localStorage), anexação de fotos e vídeos no navegador (IndexedDB).
- Leitura da última mensagem em voz do dispositivo e ditado por voz se o navegador suportar.
- Exportação/importação de mensagens em JSON e exportação de chats em texto (arquivos de mídia não são embutidos no backup).
- Instalável como PWA em browsers compatíveis; arquivos estáticos disponíveis offline depois da primeira visita.

**Importante:** O modo de demonstração não é um modelo de IA treinado e **não reconhece o conteúdo das fotos/vídeos**, apenas recebe os anexos para exibição. A conversa com IA, a análise visual e a geração de retratos exigem o backend completo e uma chave de API.

## Publicar imediatamente (demonstração)

Use o ZIP `Lunaria_NetlifyDrop_Demonstracao.zip`, que contém os arquivos estáticos diretamente na raiz. Arraste o arquivo para https://app.netlify.com/drop. Não configure nada: ele já abre e responde localmente em modo demonstração.

## Publicar com IA real e geração de imagens (versão completa)

1. Extraia `Lunaria_ProjetoCompleto_IA.zip`.
2. Envie **todo o projeto** (incluindo `netlify.toml`, `public/` e `netlify/functions/`) para um repositório no GitHub e conecte-o ao Netlify; em alternativa, use o Netlify CLI com a pasta do projeto para implantar as Functions.
3. No Netlify, vá a **Project configuration → Environment variables** e crie:
   - `OPENAI_API_KEY`: sua chave de API, obtida no painel da API OpenAI. **Nunca coloque a chave no HTML, JS ou GitHub.**
   - `APP_ACCESS_CODE`: código forte, privado, exclusivo para autorizar chamadas cobradas à API (recomendação: 20+ caracteres aleatórios).
   - Opcional `OPENAI_CHAT_MODEL` (padrão: `gpt-4.1-mini`).
   - Opcional `OPENAI_IMAGE_MODEL` (padrão: `gpt-image-1-mini`).
4. Reimplante o site após configurar variáveis (sem isto as Functions continuarão em modo demonstração).
5. Abra o aplicativo publicado, vá a **Configurações → Conexão com IA**, digite `APP_ACCESS_CODE` e pressione **Conectar com código**. A interface indicará **IA conectada**.
6. Teste uma mensagem e a função **Gerar retrato com IA** dentro do perfil.

No Netlify, configure as variáveis também com escopo para Functions. A assinatura ChatGPT Plus **não inclui** uso gratuito da API; conversas e imagens podem gerar cobranças. Defina limites de gasto no provedor e evite publicar o código de acesso.

**Importante sobre Netlify Drop:** arrastar somente os arquivos estáticos do ZIP da demonstração **não implanta as Netlify Functions**. O ZIP completo requer conexão com Git ou deploy com CLI/API para ativar o backend com segurança.

## Estrutura

```text
public/
  index.html               Interface responsiva
  style.css                Design minimalista
  app.js                   TypeScript compilado
  assets/*.webp            Retratos e imagem decorativa
  favicon.svg, icon-*.png  Identidade e ícones PWA
  manifest.webmanifest     Instalação PWA
  sw.js                    Cache offline dos arquivos estáticos
src/
  app.ts                   Fonte TypeScript
netlify/functions/
  status.mjs               Detecta API e código autorizados
  chat.mjs                 Chat com IA + análise de quadros de imagens/vídeos
  image.mjs                Geração de retratos ilustrados
netlify.toml               Configuração de deploy
package.json, tsconfig.json
```

Para editar TypeScript, instale Node.js e execute `npm install` e `npm run build`. `public/app.js` já está compilado, de modo que você não precisa compilar nada para publicar a versão incluída.

## Privacidade e limitações

- Conversas e mídias são salvas **no navegador atual**, não sincronizam entre dispositivos. Limpá-lo ou usar outro aparelho remove o acesso a esses dados sem backup.
- **Fotos e vídeos:** os arquivos são guardados localmente. Com a IA conectada, imagens são redimensionadas e **até dois quadros** de vídeos são enviados junto à mensagem, para o personagem comentar. A IA **não assiste ao vídeo inteiro**, não ouve áudio de vídeo e não lê anexos antigos automaticamente.
- **Geração de retratos:** está conectada à API de imagens, sujeita a preço, regras e disponibilidade do provedor. Manter a aparência dos personagens perfeitamente idêntica em imagens sucessivas ainda não é garantido na v1.
- **Vídeos gerados por IA e chamadas de vídeo:** **não implementados nesta versão**. A v1 permite anexar e exibir vídeos, e envia quadros para análise com a API.
- **Voz:** a leitura usa vozes do aparelho, não clonagem de voz de personagens. Ditado depende do navegador e permissão do microfone.
- **+18:** o modo íntimo trabalha romance maduro e sensualidade sugerida entre adultos, **não produz conteúdo sexual explícito**. A autodeclaração de maioridade não constitui verificação documental de identidade.
- **Sem contas:** os dados são isolados no armazenamento local, não há login nem sincronização. Não divulgue o site com API/código privados.
- **Sem moedas:** não existe cobrança por mensagem na UI; isso não elimina custos reais da API para o responsável pelo site.

## Check-list rápido

- [x] HTML, CSS e TypeScript sem frameworks; boa usabilidade mobile.
- [x] Conversas, personagens, favoritos, histórias, modo +18 sugestivo.
- [x] Armazenamento local, exportação/importação, PWA e cache offline.
- [x] Backend opcional para chat multimodal e geração de retratos.
- [ ] Sincronização entre aparelhos e autenticação real.
- [ ] Geração real de vídeo e consistência visual avançada.
- [ ] Memória semântica avançada de longo prazo (v1 usa as mensagens recentes do chat).
- [ ] Testes e controles de produção adicionais antes de abrir para público.

Criado como protótipo técnico, não como um serviço público pronto para escala.
