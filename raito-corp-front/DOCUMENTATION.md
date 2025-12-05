# Documentação Técnica do Projeto

Este documento fornece informações detalhadas para desenvolvedores sobre como configurar, desenvolver, testar e implantar a aplicação `raito-corp-front`.

## 1. Primeiros Passos

### 1.1. Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 20.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [Angular CLI](https://angular.dev/tools/cli) (versão 19.x ou superior)
- [Docker](https://www.docker.com/) (para implantação)

### 1.2. Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd raito-corp-front
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    ng serve
    ```
    Após a execução, a aplicação estará disponível em `http://localhost:4200/`. O servidor recarregará automaticamente a aplicação sempre que um arquivo for modificado.

## 2. Scripts Disponíveis

O arquivo `package.json` define vários scripts para automatizar tarefas comuns de desenvolvimento:

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção. Os artefatos são gerados no diretório `dist/`.
- `npm run watch`: Executa o build em modo de observação, útil para desenvolvimento.
- `npm test`: Executa os testes unitários com o Karma.
- `npm run lint`: Analisa o código em busca de erros de linting.

## 3. Detalhes dos Módulos Principais

A aplicação segue uma convenção onde o **código-fonte (componentes, serviços) está em inglês**, mas as **rotas de navegação estão em português** (ex: componente `CartComponent` acessível via `/carrinho`).

A aplicação é estruturada em módulos baseados em funcionalidades. Abaixo estão os principais:

- **`admin`**: Contém toda a lógica do painel administrativo, incluindo gerenciamento de produtos, estoque e pedidos. O acesso é protegido pelo `admin.guard`.
- **`catalog`**: Responsável por exibir a lista de produtos disponíveis para os clientes.
- **`cart`**: Gerencia o carrinho de compras do usuário, permitindo adicionar, remover e visualizar itens.
- **`login`**: Lida com a autenticação de usuários, incluindo os formulários de login e registro.
- **`visualizador-3d`**: Um componente especializado para renderizar modelos 3D interativos. Ele é projetado para ser reutilizável e pode ser incorporado em outras partes da aplicação, como na página de detalhes do produto.

## 4. Testes

### 4.1. Testes Unitários

Para executar os testes unitários, utilize o seguinte comando:

```bash
ng test
```

Os testes são escritos com o framework Jasmine e executados pelo Karma. Os arquivos de teste estão localizados ao lado dos arquivos de código-fonte (ex: `component.spec.ts`).

### 4.2. Testes End-to-End (E2E)

O projeto está configurado para suportar testes E2E, mas um framework específico (como Cypress ou Playwright) precisa ser adicionado. Para executar os testes E2E (após a configuração), use:

```bash
ng e2e
```

## 5. Implantação com Docker

A aplicação é projetada para ser implantada em um contêiner Docker, garantindo consistência entre os ambientes de desenvolvimento e produção.

1.  **Construa a imagem Docker:**
    ```bash
    docker build -t raito-corp-front .
    ```

2.  **Execute o contêiner:**
    ```bash
    docker run -p 80:80 raito-corp-front
    ```
    Isso iniciará um servidor Nginx que servirá a aplicação na porta 80.

Consulte os arquivos `Dockerfile` e `docker-compose.yml` para mais detalhes sobre a configuração do ambiente de produção.
