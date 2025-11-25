# FAQ - Perguntas Frequentes

Este documento reúne respostas para as dúvidas mais comuns sobre o projeto `raito-corp-front`.

### 1. Como posso adicionar um novo modelo 3D ao visualizador?

Para adicionar um novo modelo, siga estes passos:

1.  **Adicione o arquivo do modelo**: Coloque o arquivo do seu modelo 3D (em formatos como `.gltf` ou `.obj`) na pasta `src/assets/models/`.
2.  **Atualize o componente**: No componente `visualizador-3d`, modifique o código de carregamento do modelo para referenciar o novo arquivo. Você precisará ajustar o `SceneLoader` do Babylon.js ou o `GLTFLoader` do three.js, dependendo de qual estiver em uso.
3.  **Ajuste as configurações**: Se necessário, ajuste as configurações de câmera, iluminação e materiais para garantir que o modelo seja exibido corretamente.

### 2. Como funciona o sistema de autenticação?

O sistema de autenticação utiliza `guards` do Angular para proteger as rotas.

- **`authGuard`**: Verifica se existe um token de autenticação válido (por exemplo, no `localStorage`). Se o usuário não estiver logado, ele é redirecionado para a página de login.
- **`adminGuard`**: Além de verificar a autenticação, este `guard` também checa se o usuário possui permissões de administrador. Ele é usado para proteger o painel de administração (`/admin`).

A lógica de login e gerenciamento de tokens fica centralizada nos serviços de autenticação, localizados em `src/app/core/services/`.

### 3. Qual versão do Node.js e do Angular devo usar?

O projeto foi desenvolvido e testado com as seguintes versões:

- **Node.js**: `v20.x`
- **Angular**: `v17.x`
- **Angular CLI**: `v17.x`

É altamente recomendável usar essas versões para evitar problemas de compatibilidade.

### 4. Como posso adicionar uma nova dependência ao projeto?

Para adicionar uma nova dependência, utilize o `npm`:

```bash
# Para dependências de produção
npm install <nome-do-pacote>

# Para dependências de desenvolvimento
npm install <nome-do-pacote> --save-dev
```

Após a instalação, o Angular CLI irá atualizar automaticamente o arquivo `package.json`. Lembre-se de importar o novo módulo ou biblioteca onde for necessário.

### 5. Onde posso encontrar a configuração do Nginx?

A configuração do Nginx para o ambiente de produção está no arquivo `nginx.conf`, localizado na raiz do projeto. Este arquivo é copiado para a imagem Docker durante o processo de build e define como a aplicação Angular é servida.

### 6. Como posso criar um novo componente?

Utilize o Angular CLI para gerar um novo componente `standalone`:

```bash
ng generate component nome-do-componente
```

O CLI criará automaticamente os arquivos `.ts`, `.html`, `.scss` e `.spec.ts` para o novo componente, seguindo as melhores práticas do Angular.
