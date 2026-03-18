# open-tarot

Frontend principal da plataforma de tarot com IA. React + Firebase + Gemini AI.

## Stack

- React 18+ com TypeScript
- Firebase Hosting (deploy)
- Firebase Auth (autenticacao)
- Gemini AI (interpretacoes de tarot com IA)
- Google Maps (visualizacao de mapa astral)
- CSS/Styled Components

## Funcionalidades principais

- Leituras de tarot com interpretacao por IA (Gemini)
- Mapas astrais (consome fireabse-astro-api)
- Sistema de fichas (consome open-tarot-token-manager)
- Anuncios contextuais (consome firebase-amazon-ads)

## APIs consumidas

| API | URL | Funcao |
|-----|-----|--------|
| open-tarot-token-manager | Firebase Functions | Fichas, pagamentos Stripe |
| fireabse-astro-api | Firebase Functions | Mapas astrais |
| firebase-amazon-ads | Firebase Functions | Produtos Amazon contextuais |

## Comandos

```bash
npm install
npm run dev           # Dev server
npm run build         # Build producao
npm test              # Jest
firebase deploy       # Deploy Firebase Hosting
```

## Deploy

Firebase Hosting. CI/CD via GitHub Actions (se configurado).
