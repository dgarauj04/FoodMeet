# 🍽️ FoodMeet

**FoodMeet** é um painel de receitas visual, divertido e centralizado, que resolve o problema de decidir o que cozinhar sem precisar abrir dezenas de abas cheias de anúncios.

---

## 🧠 Problemática

Decidir o que cozinhar é difícil quando as receitas estão espalhadas em sites poluídos por anúncios, e comparar opções por ingrediente ou origem exige abrir várias abas. Falta uma ferramenta que responda à pergunta real do usuário — "o que eu faço com o que já tenho na geladeira?" — em vez de exigir que ele saiba o nome exato do prato.

## 🎯 Objetivo da Aplicação

Oferecer uma aplicação React responsiva e publicada que consuma uma API pública de receitas e permita ao usuário **buscar, filtrar, comparar e favoritar** receitas em uma interface limpa, sem cadastro e sem distrações.

## 🛠️ Tecnologias Utilizadas

- **React** + **Vite**
- **CSS puro** (por componente)
- **React Router DOM** (roteamento entre páginas)
- **Context API** (estado global de favoritos, comparação e tema)
- **localStorage** (persistência de favoritos, sem backend)
- **Fetch API** (consumo da API pública)

## 🔌 API Utilizada

**[TheMealDB](https://www.themealdb.com/api.php)** — API pública de receitas, com chave de teste `1`, sem necessidade de cadastro.

Endpoints utilizados:

- `search.php?s=` — busca por nome
- `filter.php?i=` — busca por ingrediente
- `filter.php?c=` / `filter.php?a=` — filtro por categoria e por país/origem
- `list.php?c=/a=/i=` — listas para popular os filtros
- `lookup.php?i=` — detalhes completos de uma receita
- `random.php` — receita aleatória

## ✨ Principais Funcionalidades

- 🔎 **Busca** por nome ou por ingrediente principal
- 🌎 **Filtro** por categoria e por país/origem
- 📊 **Comparação** de duas receitas lado a lado, com ingredientes em comum destacados
- ❤️ **Favoritos** salvos localmente (`localStorage`), sem necessidade de login
- 📋 **Detalhes da receita**: foto, ingredientes com medidas, instruções passo a passo e vídeo (quando disponível)
- ⚠️ Estados de interface para carregamento, erro e resultado vazio

## 🚀 Instruções para Executar o Projeto

```bash
# 1. Clonar o repositório
git clone https://github.com/<seu-usuario>/foodmeet.git

# 2. Entrar na pasta do projeto
cd foodmeet

# 3. Instalar as dependências
npm install

# 4. Rodar o projeto em modo desenvolvimento
npm run dev

# 5. Acessar no navegador
http://localhost:5173
```

**Variáveis de ambiente:** copie o arquivo `.env.example` para `.env` e ajuste se necessário (`VITE_MEALDB_BASE_URL`, `VITE_MEALDB_VERSION=1`).

## 🌐 Link da Aplicação Publicada

> 🔗 `https://food-meett.vercel.app/`

## 🤖 Uso de Inteligência Artificial

A IA (Claude) foi utilizada como ferramenta de apoio para estruturar a documentação inicial do projeto e planejar a arquitetura de pastas, sem escrever o código final da aplicação.

### Prompt utilizado 1

"Atue como um Arquiteto de Software e Product Manager experiente. Estou planejando desenvolver um projeto chamado Painel de Receitas, uma aplicação web focada em ter uma interface altamente visual, divertida e intuitiva.
Por favor, estruture, analise e expanda a documentação inicial deste projeto dividindo sua resposta exatamente nos seguintes tópicos:

1. Problema: Detalhe as dores do usuário (ex: dificuldade em decidir o que cozinhar, receitas espalhadas em sites poluídos por anúncios, dificuldade de comparar opções e a frustração de não achar receitas com os ingredientes que já se tem na geladeira sem abrir dezenas de abas).
2. Ideia: Descreva a solução central do Painel de Receitas e como ele resolve o problema acima através de uma experiência centralizada.
3. Usuário: Defina o público-alvo (pessoas que cozinham em casa, exploradores de culinária internacional, pessoas buscando reduzir desperdício de alimentos, etc.).
4. Requisitos: Liste os principais requisitos funcionais e não-funcionais da aplicação, mantendo o foco em uma excelente UI/UX.
5. API (Análise e Recomendação):
   - Analise o uso da API TheMealDB (que possui chave pública de teste "1" e não exige cadastro inicial).
   - Apresente outras alternativas de APIs de receitas e culinária disponíveis no mercado (ex: Spoonacular, Edamam, etc.), destacando prós e contras.
   - Conclua me dizendo qual é a melhor API para este projeto específico e por quê.
6. Funcionalidades (Possibilidades e Essenciais): Faça um brainstorming de funcionalidades para a plataforma e, em seguida, defina o que é essencial para o MVP (Produto Mínimo Viável). Você deve obrigatoriamente incluir e detalhar como funcionarão as seguintes features:
   - 🔎 Busca (por nome, ingrediente principal, etc.)
   - 🌎 Filtro (por origem/país, categoria)
   - 📊 Comparação (como comparar duas receitas lado a lado de forma visual)
   - ❤️ Favoritos (salvar para depois)
   - 📋 Visualização de detalhes (foto, ingredientes, medidas precisas, instruções em passo a passo e/ou vídeo)
   - Bônus: Sugira de 1 ou mais outras funcionalidades extras que sejam totalmente coerentes com a proposta de ser visual, divertido e resolver o problema da geladeira.
     Entregue a resposta formatada em Markdown, de forma clara, profissional e pronta para ser usada como escopo inicial de desenvolvimento."

### Objetivo

Estruturar rapidamente a documentação inicial do projeto — problema, público-alvo, requisitos, escolha de API e funcionalidades — a partir de uma ideia ainda pouco desenvolvida, garantindo que o escopo do MVP e as decisões técnicas (como a escolha da TheMealDB) fossem justificadas antes de começar a codificar.

### Prompt utilizado 2

"Atue como um UI/UX Designer Sênior e Especialista em Front-end. Preciso criar a interface visual completa de um projeto chamado FoodMeet, que é um Painel de Receitas (a mais visual/divertida) voltado para pessoas que queiram descobrir pratos, usar o que tem em casa, decidir rápido o que preparar e escolher entre duas opções.

O design deve ter um aspecto altamente profissional, moderno e polido, com qualidade de produto SaaS comercial.

Por favor, desenvolva a documentação visual deste projeto dividindo sua resposta nos seguintes tópicos:
1. Direção de Arte e Design System:
   - Paleta de Cores: Defina as cores primárias, secundárias, background, texto e cores de feedback (sucesso, erro), fornecendo os códigos HEX. Explique rapidamente a psicologia por trás da escolha.
   - Tipografia: Sugira duas fontes do Google Fonts (uma para títulos, outra para textos longos) que combinem com a temática.
   - Estilo Visual: Defina o estilo dos elementos (ex: bordas arredondadas ou retas, uso de glassmorphism, sombras suaves, dark mode/light mode).
2. Estrutura de Telas e Layout:
   - Liste as principais telas que compõem o MVP.
   - Defina a macro-estrutura da tela principal (ex: Sidebar fixa à esquerda, Header com barra de busca, Grid central para conteúdo principal).
3. Componentes Chave:
   - Descreva os 3 ou 4 componentes mais importantes da interface e como eles devem parecer (ex: "Card de Receita com imagem no topo, título em negrito e botão de favoritar flutuante" ou "Gráfico de radar com fundo translúcido").
4. O Prompt de Geração (Para ferramentas Low-Code / AI Design):
   - Com base em tudo o que foi definido acima, crie um prompt em inglês altamente descritivo e técnico, focado em React, que eu possa copiar e colar diretamente em ferramentas como v0.dev, Banani, Stitch, Bolt.new ou Lovable.dev para que a IA gere a tela principal perfeitamente. O prompt deve instruir a ferramenta sobre layout, cores exatas, espaçamentos, responsividade e comportamento dos componentes.

### Objetivo

Criar um design da interface visual completa e profissional para o FoodMeet, focando na experiência do usuário e na apresentação de receitas de forma atraente e intuitiva, para que possa ser usado como base para a construção e implementação.

---

_Desenvolvido como parte do Desafio 02 (Painel Interativo com API Pública) da Kodie Academy._
