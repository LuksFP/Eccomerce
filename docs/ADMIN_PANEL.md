# Painel Administrativo - LojaElegante

## Visão Geral

O Painel Administrativo é uma área exclusiva para administradores da loja, oferecendo uma visão completa das vendas, estoque e métricas de performance.

## Acesso ao Painel

### Via Menu do Usuário (Header)
1. Faça login com uma conta de administrador
2. Clique no ícone de usuário no canto superior direito
3. Selecione **"Painel Admin"** no menu dropdown

### Via Página de Perfil
1. Acesse seu perfil clicando em **"Meu Perfil"**
2. Uma aba **"Painel Admin"** estará disponível para usuários admin
3. Clique na aba para ver o dashboard completo

### Via Menu Mobile
1. Abra o menu hambúrguer no mobile
2. Role até encontrar **"Painel Admin"**
3. Toque para acessar

### URL Direta
- Acesse `/admin` para ir direto ao painel de gerenciamento
- Acesse `/perfil` e selecione a aba "Painel Admin" para ver o dashboard

---

## Funcionalidades

### 1. Dashboard de Vendas

O dashboard exibe métricas chave de performance:

- **Receita Total**: Soma de todas as vendas concluídas
- **Total de Pedidos**: Quantidade de pedidos realizados
- **Ticket Médio**: Valor médio por pedido
- **Taxa de Conversão**: Percentual de pedidos não cancelados

#### Gráficos Disponíveis
- **Faturamento Mensal**: Barras mostrando receita por mês
- **Pedidos por Dia**: Linha com pedidos dos últimos 7 dias
- **Vendas por Categoria**: Pizza com distribuição por categoria
- **Status dos Pedidos**: Pizza com distribuição de status
- **Produtos Mais Vendidos**: Ranking dos top 5 produtos

---

### 2. Alertas de Estoque Baixo

Sistema automático que alerta quando produtos estão com estoque crítico:

- **Vermelho (Sem Estoque)**: Produtos com 0 unidades
- **Amarelo (Crítico)**: Produtos com 1-5 unidades
- **Alerta (Baixo)**: Produtos com 6-10 unidades

Os alertas aparecem automaticamente no topo do dashboard quando há produtos com estoque baixo.

---

### 3. Gráfico de Tendência de Vendas

Visualização interativa da tendência de vendas com períodos selecionáveis:

- **Por Semana**: Últimas 8 semanas
- **Por Mês**: Últimos 6 meses
- **Por Trimestre**: Últimos 4 trimestres

Inclui indicador de tendência comparando com o período anterior (crescimento/queda %).

---

### 4. Exportação de Relatórios

Exporte dados de vendas em dois formatos:

#### Excel (.xlsx)
Arquivo completo com 4 abas:
- **Resumo**: Métricas gerais da loja
- **Pedidos**: Lista detalhada de todos os pedidos
- **Produtos Vendidos**: Ranking de produtos por receita
- **Estoque**: Status atual de estoque de todos os produtos

#### CSV (.csv)
Arquivo simples contendo apenas a lista de pedidos, ideal para importação em outros sistemas.

---

### 5. Gerenciamento de Produtos

Na página `/admin`, você pode:

- Ver todos os produtos cadastrados
- Editar quantidade em estoque
- Visualizar produtos com estoque baixo destacados

### 6. Gerenciamento de Pedidos

Na página `/admin`, você pode:

- Ver todos os pedidos de todos os usuários
- Atualizar status dos pedidos (Pendente → Processando → Enviado → Entregue)
- Filtrar e buscar pedidos

---

## Requisitos de Acesso

Para acessar o painel administrativo, o usuário precisa:

1. Ter uma conta autenticada na plataforma
2. Possuir a role `admin` na tabela `user_roles`

### Conta Admin Padrão
- Email: `admin@loja.com`
- Role: `admin` (atribuída automaticamente no primeiro cadastro)

---

## Segurança

- Todas as operações admin são protegidas por RLS (Row Level Security)
- Apenas usuários com role `admin` podem:
  - Ver todos os pedidos
  - Atualizar status de pedidos
  - Modificar estoque de produtos
  - Ver perfis de outros usuários

---

## Tecnologias Utilizadas

- **React** + **TypeScript** para o frontend
- **Recharts** para visualização de dados
- **xlsx** para exportação de relatórios
- **Supabase** para autenticação e banco de dados
- **Tailwind CSS** para estilização
