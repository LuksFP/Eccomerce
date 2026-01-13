# 🛍️ LojaElegante - E-commerce Moderno

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Plataforma de e-commerce completa com painel administrativo, chatbot com IA e experiência de compra premium.**

</div>

---

## ✨ Funcionalidades

### 🛒 Experiência de Compra
- **Catálogo de Produtos** - Navegação por categorias com filtros avançados
- **Busca Inteligente** - Autocomplete e busca por voz
- **Carrinho Dinâmico** - Atualização em tempo real com persistência
- **Comparação de Produtos** - Compare até 4 produtos lado a lado
- **Lista de Desejos** - Favoritos com opção de compartilhamento
- **Cupons de Desconto** - Sistema completo de validação de cupons

### 💳 Checkout
- **Múltiplos Pagamentos** - Cartão de crédito, PIX e Boleto
- **Cálculo de Frete** - Integração com calculadora de CEP
- **Endereços Salvos** - Gestão de endereços de entrega

### 📦 Gestão de Pedidos
- **Rastreamento** - Acompanhe o status em tempo real
- **Histórico Completo** - Visualize todos os pedidos anteriores
- **Cancelamento** - Cancele pedidos pendentes facilmente

### 🤖 Inteligência Artificial
- **Chatbot Assistente** - Suporte 24/7 com IA generativa
- **Moderação de Conteúdo** - Filtro automático de avaliações
- **Recomendações** - Produtos baseados no histórico de navegação

### 👨‍💼 Painel Administrativo
- **Dashboard de Vendas** - Métricas e KPIs em tempo real
- **Gráficos Interativos** - Faturamento, tendências e categorias
- **Alertas de Estoque** - Notificações automáticas para estoque baixo
- **Exportação de Relatórios** - Excel e CSV com dados completos
- **Gestão de Produtos** - CRUD completo com controle de estoque
- **Gestão de Pedidos** - Atualização de status e visualização

### 🔐 Segurança
- **Autenticação Robusta** - Login/cadastro com Supabase Auth
- **Row Level Security** - Políticas RLS em todas as tabelas
- **Validação de Entrada** - Sanitização e validação em Edge Functions
- **Rate Limiting** - Proteção contra abuso de API

---

## 🚀 Tecnologias

| Frontend | Backend | Ferramentas |
|----------|---------|-------------|
| React 18 | Supabase | Vite |
| TypeScript | PostgreSQL | ESLint |
| Tailwind CSS | Edge Functions | Recharts |
| Shadcn/UI | Row Level Security | XLSX |
| React Router | Realtime Subscriptions | Lucide Icons |
| React Query | Storage Buckets | |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Admin/           # Dashboard, alertas, exportação
│   ├── Cart/            # Carrinho de compras
│   ├── Chatbot/         # Widget de chatbot com IA
│   ├── Compare/         # Comparação de produtos
│   ├── Filters/         # Filtros e busca
│   ├── Header/          # Navegação principal
│   ├── ProductCard/     # Card de produto
│   ├── Reviews/         # Avaliações de produtos
│   └── ui/              # Shadcn UI components
├── context/             # React Contexts (Auth, Cart, etc.)
├── hooks/               # Custom hooks
├── pages/               # Páginas da aplicação
├── types/               # TypeScript types
└── utils/               # Funções utilitárias

supabase/
├── functions/           # Edge Functions
│   └── ai-chatbot/      # Chatbot com IA
└── migrations/          # Migrações do banco

docs/
└── ADMIN_PANEL.md       # Documentação do painel admin
```

---

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou bun

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/loja-elegante.git
cd loja-elegante

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📊 Painel Administrativo

O painel admin oferece visão completa do negócio:

| Funcionalidade | Descrição |
|----------------|-----------|
| 📈 Dashboard | KPIs, gráficos de faturamento e tendências |
| ⚠️ Alertas | Notificações automáticas de estoque baixo |
| 📤 Exportação | Relatórios em Excel/CSV |
| 📦 Produtos | Gestão completa de catálogo |
| 🛒 Pedidos | Acompanhamento e atualização de status |

**Acesso:** Faça login como admin e acesse via menu ou `/perfil` → aba "Painel Admin"

[📖 Documentação completa do Painel Admin](./docs/ADMIN_PANEL.md)

---

## 🔒 Segurança

- ✅ Autenticação com Supabase Auth
- ✅ RLS (Row Level Security) em todas as tabelas
- ✅ Validação de entrada em Edge Functions
- ✅ Sanitização de conteúdo gerado por usuários
- ✅ Rate limiting no chatbot
- ✅ Roles separadas (admin/user) em tabela dedicada

---

## 📱 Responsividade

O projeto é totalmente responsivo, otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Wide screens (1440px+)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

</div>
