# open-tarot

Frontend principal da plataforma de tarot com IA. React 19 + Firebase + Gemini AI.

## Stack

- **React 19** com TypeScript ~5.7 (strict: true, noUnusedLocals, noUnusedParameters)
- **Vite 6** com @vitejs/plugin-react (Babel)
- **Firebase SDK v11** (modular ESM — tree-shaking automatico)
  - Firebase Hosting (deploy)
  - Firebase Auth com `browserLocalPersistence` e `react-firebase-hooks/auth`
  - Firestore (historico de leituras, fichas, carta do dia)
- **Gemini AI** via proxy em `fireabse-astro-api` (`VITE_ASTRO_API/ai/interpret`) — chave no servidor, nao exposta no bundle
- **Google Maps** via `@react-google-maps/api` (mapa astral)
- **react-router-dom v7** — 14 rotas, todas importadas estaticamente (sem lazy loading ainda)
- **Tailwind CSS** (sem Styled Components)

## Funcionalidades principais

- Leituras de tarot com interpretacao por IA (Gemini) — tiragem de 3 cartas (passado/presente/futuro)
- Carta do dia com interpretacao automatica
- Interpretacao de sonhos (DreamInterpreter)
- Mapas astrais (consome fireabse-astro-api)
- Sistema de fichas (consome open-tarot-token-manager)
- Anuncios contextuais (consome firebase-amazon-ads)

## APIs consumidas

| API | Env Var | Funcao |
|-----|---------|--------|
| open-tarot-token-manager | `VITE_TOKEN_API` | Fichas, pagamentos Stripe |
| fireabse-astro-api | `VITE_ASTRO_API` | Mapas astrais |
| firebase-amazon-ads | `VITE_AMZ_ADS_API` | Produtos Amazon contextuais |
| Google Maps | `VITE_MAPS_API_KEY` | Visualizacao do mapa astral |
| fireabse-astro-api (proxy Gemini) | `VITE_ASTRO_API` | Interpretacoes por IA (via proxy — chave no servidor) |

## Variaveis de ambiente (VITE_*)

14 variaveis em uso. Todas com prefixo `VITE_` ficam expostas no bundle JS.
- **RESOLVIDO**: `VITE_GEMINI_API_KEY` removida — chamadas Gemini movidas para proxy em `fireabse-astro-api`.
- **CRITICO**: `VITE_UUID_ADM` exposta — UID do admin visivel. Idealmente usar Firebase Custom Claims.
- `VITE_FIREBASE_*` (6 vars): seguro no cliente, restringido por dominio no Console Firebase.

## Dominio de Tarot

- Baralho: 78 cartas — 22 Arcanos Maiores (0-21) + 56 Arcanos Menores em 4 naipes
- Naipes: Paus (Fogo), Copas (Agua), Espadas (Ar), Ouros (Terra) — indices 22-77 no modelo atual
- Campo `number` em TarotCard e indice sequencial (0-77), NAO o numero arcano
- Tiragem implementada: 3 cartas com interpretacao por IA carta a carta + conclusao integrada
- Cartas invertidas (reversed) NAO implementadas — potencial feature futura
- Referencia completa de dominio: `.claude/agent-memory/researcher/project_tarot_domain.md`

## Arquitetura de arquivos relevante

```
src/
  data/tarotDeck.ts       — definicao das 78 cartas
  services/aiEngine.ts    — chamadas ao proxy Gemini em fireabse-astro-api
  utils/promptHelper.ts   — geracao de prompts para IA
  services/firebase.ts    — inicializacao do Firebase SDK
  context/TokenProvider   — contexto global de fichas
  guards/AuthGuard        — protecao de rotas autenticadas
  guards/AdmGuard         — protecao de rotas de admin
  types/types.ts          — tipos globais compartilhados
```

## Gaps conhecidos (priorizados)

| Prioridade | Gap |
|-----------|-----|
| CRITICO | Security Rule `/amazonAds` tem `allow write: if true` — corrigir em `firestore.rules` |
| ALTO | Zero testes — adicionar Vitest + RTL (ver skill `setup-vitest`) |
| MEDIO | Lazy loading nas rotas — todas estaticas hoje |
| MEDIO | Tipar `ImportMetaEnv` em `vite-env.d.ts` (ver skill `vite-env-typing`) |
| MEDIO | `manualChunks` no Vite para Firebase/AI SDK (cache do browser) |

## Comandos

```bash
npm install
npm run dev           # Dev server (Vite, porta 5173)
npm run build         # Build producao
npm run test          # Vitest (a configurar — atualmente sem testes)
firebase deploy       # Deploy Firebase Hosting
```

## Deploy

Firebase Hosting. Build em `dist/`. SPA rewrite `"**" -> /index.html` no `firebase.json`.

## Framework de testes

**Usar Vitest, NAO Jest.** O projeto usa `"type": "module"` e Firebase SDK v11 (full ESM).
Jest tem suporte experimental a ESM que frequentemente quebra com Firebase. Vitest resolve nativamente.
Ver skill `.claude/skills/setup-vitest/SKILL.md` para configuracao completa.

## Convencoes

- Nao usar `console.log` ou `console.error` — o projeto nao tem logger proprio; usar `console` apenas onde nao ha alternativa, mas registrar como divida tecnica
- Imports Firebase: sempre nomeados (`import { getAuth } from 'firebase/auth'`) — nunca namespace style
- Auth state: sempre via `useAuthState` do react-firebase-hooks — nunca `getAuth().currentUser` diretamente em componentes
- Cleanup de listeners Firestore (`onSnapshot`) obrigatorio no return do useEffect
