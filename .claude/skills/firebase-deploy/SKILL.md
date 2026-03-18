---
name: firebase-deploy
description: Deploy do Open Tarot para Firebase Hosting
disable-model-invocation: true
---

Deploy do Open Tarot para Firebase Hosting.

## Processo

1. Build: `npm run build`
2. Deploy: `firebase deploy --only hosting`
3. Verificar URL de producao

## Pre-requisitos
- Firebase CLI instalado e autenticado
- Projeto Firebase configurado em `.firebaserc`
