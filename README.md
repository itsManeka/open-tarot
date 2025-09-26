# 🔮 Open Tarot

> **Aplicativo completo de consultas esotéricas com IA**

Open Tarot é uma plataforma web moderna e interativa que combina a sabedoria milenar do Tarot com a tecnologia de Inteligência Artificial, oferecendo interpretações personalizadas e experiências místicas únicas.

## ✨ Funcionalidades Principais

### 🃏 **Sistema de Tarot Interativo**
- **Consultas Personalizadas**: Faça perguntas específicas e receba interpretações detalhadas
- **Tiragem de 3 Cartas**: Sistema tradicional de leitura (passado, presente, futuro)
- **Interpretação com IA**: Powered by Google Gemini AI para interpretações contextualizadas
- **Histórico Completo**: Salve e revise todas suas consultas anteriores

### 🌟 **Recursos Astrológicos**
- **Mapa Astral Completo**: Cálculo automatizado baseado em data, hora e local de nascimento
- **Visualização Interativa**: Interface moderna para explorar casas, planetas e aspectos
- **Integração com Consultas**: Interpretações de Tarot considerando perfil astrológico

### 💭 **Interpretação de Sonhos**
- **Análise com IA**: Interpretação detalhada dos símbolos e significados dos sonhos
- **Interface Intuitiva**: Sistema simples para descrever e analisar sonhos

### 🎫 **Sistema de Fichas (Tokens)**
- **Resgate Diário**: Uma ficha gratuita a cada 24 horas
- **Gestão Inteligente**: Controle automático de uso e disponibilidade
- **Integração com Pagamentos**: Sistema Stripe para aquisição de fichas adicionais

### 📰 **Portal de Conteúdo**
- **Sistema de Notícias**: Artigos sobre esoterismo, astrologia e autoconhecimento
- **Editor Avançado**: Ferramenta completa para criação de conteúdo (apenas administradores)
- **Categorização**: Sistema de tags e filtros para organização

### 🛍️ **Monetização Integrada**
- **Banners Amazon**: Integração com Amazon PA-API para produtos relacionados
- **Cache Inteligente**: Otimização de performance com cache de 24h
- **Afiliação**: Sistema de links de afiliado para monetização

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e desenvolvimento
- **React Router** - Roteamento SPA
- **CSS Modules** - Estilização componentizada

### **Backend & Infraestrutura**
- **Firebase**
  - Authentication (Email/Senha + Google OAuth)
  - Firestore Database
  - Hosting
- **Google Gemini AI** - Interpretações de IA
- **Render** - Hospedagem das APIs

### **APIs Externas**
- **[Amazon PA-API](https://github.com/itsManeka/firebase-amazon-ads)** - Produtos e afiliação
- **[Token Manager API](https://github.com/itsManeka/open-tarot-token-manager)** - Gestão de fichas
- **[Astrology API](https://github.com/itsManeka/fireabse-astro-api)** - Cálculos astrológicos
- **Google Maps** - Geolocalização para mapas astrais
- **Stripe** - Processamento de pagamentos

### **Bibliotecas Principais**
- `react-firebase-hooks` - Hooks para Firebase
- `@google/generative-ai` - Integração Gemini AI
- `luxon` - Manipulação de datas
- `html2canvas` - Captura de tela para compartilhamento
- `lucide-react` - Ícones modernos

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout (Header, Footer, etc.)
│   ├── mapaAstral/     # Componentes do mapa astral
│   └── infoMaker/      # Editor de conteúdo
├── pages/              # Páginas da aplicação
├── services/           # Integrações externas
│   ├── firebase.ts    # Configuração Firebase
│   └── aiEngine.ts    # Integração Gemini AI
├── context/           # Context API (TokenProvider)
├── hooks/             # Custom hooks
├── types/             # Definições TypeScript
├── utils/             # Funções utilitárias
└── data/              # Dados estáticos (deck de tarot)
```

## 🔐 Segurança

### **Autenticação & Autorização**
- **Firebase Authentication** com persistência local
- **Guards de Rota** para proteger conteúdo autenticado
- **Admin Guard** para funcionalidades administrativas
- **Firestore Rules** para controle de acesso granular

### **Proteção de Dados**
- **Variáveis de Ambiente** para informações sensíveis
- **Validação Client-side** em formulários
- **Sanitização** de dados de entrada
- **HTTPS** obrigatório em produção

### **Regras Firestore**
```javascript
// Usuários só acessam seus próprios dados
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Conteúdo público com escrita autenticada
match /pages/{document=**} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

## ⚙️ Configuração do Ambiente

### **1. Pré-requisitos**
- Node.js 16+
- npm ou yarn
- Conta Firebase
- Chaves de API (Gemini, Stripe, etc.)

### **2. Variáveis de Ambiente**
Crie um arquivo `.env` na raiz:

```env
# Firebase
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123

# Google Gemini AI
VITE_GEMINI_API_KEY=sua-gemini-api-key

# APIs Externas
VITE_TOKEN_API=https://sua-token-api.onrender.com
VITE_AMZ_ADS_API=https://sua-amazon-api.onrender.com
VITE_ASTRO_API=https://sua-astro-api.onrender.com

# Administração
VITE_UUID_ADM=uuid-do-administrador

# Stripe (opcional)
VITE_STRIPE_PUBLIC_KEY=pk_live_ou_test_key
```

### **3. Instalação**
```bash
# Clone o repositório
git clone https://github.com/itsManeka/open-tarot.git
cd open-tarot

# Instale dependências
npm install

# Configure Firebase
# Siga as instruções em: https://firebase.google.com/docs/web/setup

# Inicie desenvolvimento
npm run dev
```

### **4. Build & Deploy**
```bash
# Build para produção
npm run build

# Deploy Firebase (após configurar firebase-tools)
firebase deploy
```

## 📋 Funcionalidades em Detalhes

### **Sistema de Tokens**
O aplicativo utiliza um sistema de fichas para controlar o uso da IA:
- **1 ficha gratuita** a cada 24 horas
- **Resgate automático** disponível quando expira o período
- **Compra de fichas** via Stripe para uso ilimitado
- **API dedicada** para gerenciamento ([Token Manager](https://github.com/itsManeka/open-tarot-token-manager))

### **Interpretação Personalizada**
- **Perfil astrológico** influencia interpretações
- **Histórico de consultas** mantém contexto
- **Prompts especializados** para diferentes tipos de consulta
- **Temperatura de IA** ajustada para criatividade e precisão

### **Monetização**
- **Banners Amazon** contextualizados por página
- **Cache inteligente** reduz chamadas à API
- **Links de afiliado** automatizados
- **Pagamentos Stripe** para fichas premium

## 🧪 Qualidade do Código

### **Padrões Implementados**
- **TypeScript** para type safety
- **ESLint** para qualidade de código
- **Componentes funcionais** com hooks
- **Context API** para estado global
- **Custom hooks** para lógica reutilizável

## 📱 Responsividade

- **Mobile-first** design approach
- **CSS Grid e Flexbox** para layouts flexíveis
- **Breakpoints** otimizados para diferentes dispositivos
- **Touch gestures** para carrosséis e navegação

## 🔄 APIs Integradas

### **1. Token Manager API**
- **Endpoint**: `/tokens/status` - Status atual
- **Endpoint**: `/tokens/claim` - Resgatar ficha
- **Endpoint**: `/tokens/use` - Consumir ficha

### **2. Amazon Ads API**
- **Endpoint**: `/search` - Buscar produtos
- **Cache**: 24h no Firestore
- **Afiliação**: Links automáticos

### **3. Astrology API**
- **Endpoint**: `/calcular` - Calcular mapa astral
- **Geocoding**: Integração Google Maps
- **Dados**: Planetas, casas, aspectos

## 📄 Licença

**Uso Não-Comercial Exclusivo**

Este código é propriedade exclusiva do autor e **não pode ser utilizado para fins comerciais por terceiros**. O uso é restrito a:

- ✅ Estudo e aprendizado pessoal
- ✅ Contribuições via pull request
- ✅ Fork para desenvolvimento pessoal
- ❌ **Uso comercial por terceiros**
- ❌ **Redistribuição comercial**
- ❌ **Venda ou licenciamento**

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Diretrizes**
- Mantenha a tipagem TypeScript
- Siga os padrões ESLint
- Documente novas funcionalidades
- Teste localmente antes do PR

## 📞 Contato & Suporte

- **GitHub**: [@itsManeka](https://github.com/itsManeka)
- **Issues**: Use o sistema de issues do GitHub
- **Email**: [emanuel.ozoriodias@gmail.com](mailto:emanuel.dias@gmail.com)


---

*Desenvolvido com ❤️ e ✨ para conectar tecnologia e espiritualidade*