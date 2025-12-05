# Arquitetura do Projeto

Este documento descreve a arquitetura do projeto `raito-corp-front`, uma aplicação web desenvolvida com foco em modularidade, performance e escalabilidade.

## 1. Visão Geral

A aplicação segue uma arquitetura baseada em componentes, utilizando o framework **Angular** na sua versão 19. A estrutura foi projetada para ser desacoplada, facilitando a manutenção e a evolução do código.

## 2. Estrutura de Pastas

A organização dos arquivos é feita por funcionalidade (`feature-based`), onde cada módulo principal da aplicação possui sua própria pasta. A estrutura principal dentro de `src/app` é a seguinte:

```
src/app/
├── admin/            # Módulo de administração (com sub-rotas)
├── assets/           # Recursos estáticos (imagens, modelos 3D)
├── cart/             # Funcionalidades do carrinho de compras
├── catalog/          # Catálogo de produtos
├── core/             # Lógica central
│   ├── guards/       # Guardas de rota (auth, admin, role)
│   └── services/     # Serviços organizados por domínio (admin, cadastro, catalogo...)
├── home/             # Página inicial
├── login/            # Módulo de autenticação
├── product-detail/   # Detalhes do produto
├── shared/           # Componentes e serviços compartilhados
│   └── models/       # Interfaces e tipos organizados por domínio
└── visualizador-3d/  # Componente de visualização 3D
```

- **`core`**: Contém a lógica de `guards` (`admin.guard.ts`, `auth.guard.ts`, `role.guard.ts`) e serviços essenciais organizados por domínio.
- **`shared`**: Armazena componentes, diretivas, pipes e modelos (`models/`) reutilizáveis em toda a aplicação.
- **Módulos de funcionalidade**: Cada pasta (ex: `cart`, `catalog`) contém os componentes, templates e estilos específicos daquela funcionalidade.

### 2.1 Convenção de Nomenclatura

O projeto adota a seguinte convenção:
- **Código-fonte (Pastas, Arquivos, Classes, Variáveis):** Inglês (ex: `CartComponent`, `ProductService`).
- **Rotas (URLs):** Português (ex: `/carrinho`, `/catalogo`).

## 3. Framework e Tecnologias

### 3.1. Angular 19

A aplicação utiliza os recursos mais recentes do Angular, incluindo:

- **Standalone Components**: Todos os componentes são declarados como `standalone`, eliminando a necessidade de `NgModules` e simplificando a arquitetura.
- **Lazy Loading**: As rotas são carregadas sob demanda (`loadComponent`), o que melhora significativamente o tempo de carregamento inicial da aplicação. O arquivo `app.routes.ts` centraliza a definição dessas rotas.

### 3.2. Visualização 3D

Um dos principais recursos do projeto é a renderização de modelos 3D. Para isso, foram integradas duas das principais bibliotecas do mercado:

- **`three.js`**: Uma biblioteca versátil e de baixo nível para criar e exibir gráficos 3D no navegador.
- **`babylon.js`**: Um framework completo para desenvolvimento de jogos e visualizações 3D, conhecido por sua facilidade de uso e recursos avançados.

O componente `visualizador-3d` é o responsável por encapsular a lógica de renderização, permitindo que seja facilmente integrado em outras partes do sistema.

## 4. Gerenciamento de Estado

Para o gerenciamento de estado, a aplicação utiliza principalmente **RxJS** e **Angular Services**. Os serviços são injetados nos componentes e atuam como a fonte única da verdade (`single source of truth`), compartilhando dados de forma reativa e consistente entre diferentes partes da aplicação.

## 5. Roteamento

O sistema de roteamento é definido no arquivo `app.routes.ts`. Ele utiliza `guards` para proteger rotas específicas:

- **`authGuard`**: Verifica se o usuário está autenticado antes de acessar áreas restritas.
- **`adminGuard`**: Garante que apenas usuários com perfil de administrador possam acessar o painel de administração (`/admin`).
- **`roleGuard`**: Um guard genérico que permite proteger rotas baseando-se em um array de papéis (`roles`) passados via `data` da rota.

A rota `/admin` é um exemplo de aninhamento (`nested routes`), contendo sub-rotas como `dashboard`, `products`, `stock` e `orders`. O módulo administrativo também utiliza componentes de suporte, como o `product-modal` para edição de itens.

## 6. Implantação (Deployment)

A aplicação é containerizada utilizando **Docker**. O `Dockerfile` define a imagem da aplicação, que é servida através de um servidor web **Nginx**. Essa abordagem garante um ambiente de implantação consistente e isolado, facilitando o deploy em qualquer ambiente que suporte Docker.
