# Documentação de Integração Front-end Angular com Back-end Java Spring

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Autenticação](#arquitetura-de-autenticação)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Endpoints da API](#endpoints-da-api)
6. [Modelos de Dados](#modelos-de-dados)
7. [Autenticação JWT](#autenticação-jwt)
8. [Interceptors HTTP](#interceptors-http)
9. [Guards de Rota](#guards-de-rota)
10. [Serviços](#serviços)
11. [Como Usar Docker](#como-usar-docker)
12. [Deploy em Produção](#deploy-em-produção)
13. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este front-end Angular está preparado para integração com um back-end Java Spring Boot que implementa autenticação JWT e controle de acesso baseado em roles (RBAC).

### Tecnologias Utilizadas

- **Front-end**: Angular 19.2.0
- **Back-end**: Java Spring Boot (a ser implementado)
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis (opcional)
- **Containerização**: Docker & Docker Compose

---

## Arquitetura de Autenticação

### Fluxo de Autenticação

```
1. Usuário faz login (email + password)
   ↓
2. Back-end valida credenciais
   ↓
3. Back-end gera access token + refresh token
   ↓
4. Front-end armazena tokens no localStorage
   ↓
5. Todas as requisições incluem: Authorization: Bearer {token}
   ↓
6. Back-end valida token em cada requisição
   ↓
7. Se token expirar, front-end renova automaticamente
```

### Estrutura do Token JWT

```json
{
  "sub": "user@email.com",
  "userId": 123,
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                          # Módulos principais da aplicação
│   │   ├── guards/
│   │   │   ├── auth.guard.ts          # Protege rotas autenticadas
│   │   │   ├── admin.guard.ts         # Protege rotas de admin
│   │   │   └── role.guard.ts          # Guard genérico por role
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # Adiciona token JWT nas requisições
│   │   │   └── error.interceptor.ts   # Tratamento global de erros
│   │   └── services/
│   │       ├── auth.service.ts        # Gerencia autenticação
│   │       ├── api.service.ts         # Serviço genérico de API
│   │       ├── product.service.ts     # CRUD de produtos
│   │       ├── order.service.ts       # CRUD de pedidos
│   │       └── error-handler.service.ts
│   ├── shared/                        # Componentes compartilhados
│   ├── admin/                         # Módulo administrativo
│   ├── catalog/                       # Catálogo de produtos
│   ├── cart/                          # Carrinho de compras
│   └── login/                         # Página de login
├── environments/
│   ├── environment.ts                 # Configurações de produção
│   └── environment.development.ts     # Configurações de desenvolvimento
└── ...
```

---

## Configuração do Ambiente

### 1. Arquivos de Environment

#### `environment.development.ts` (Desenvolvimento)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  tokenKey: 'raito_auth_token',
  refreshTokenKey: 'raito_refresh_token',
  enableDebugLogs: true,
  enableMockData: true
};
```

#### `environment.ts` (Produção)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.raitocorp.com/api',
  apiTimeout: 30000,
  tokenKey: 'raito_auth_token',
  refreshTokenKey: 'raito_refresh_token',
  enableDebugLogs: false,
  enableMockData: false
};
```

### 2. Configuração do Angular

O arquivo `app.config.ts` já está configurado com:

- HTTP Client
- Interceptors (Auth e Error)
- Error Handler global
- Roteamento com Guards

---

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Body | Response |
|--------|----------|-----------|------|----------|
| POST | `/api/auth/login` | Login do usuário | `{email, password}` | `{accessToken, refreshToken, user}` |
| POST | `/api/auth/refresh` | Renovar token | `{refreshToken}` | `{accessToken, refreshToken}` |
| POST | `/api/auth/logout` | Logout | - | `{message}` |
| POST | `/api/auth/register` | Registrar usuário | `{email, password, nome}` | `{user}` |

### Produtos

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/products` | Listar produtos (paginado) | Não | - |
| GET | `/api/products/{id}` | Buscar produto por ID | Não | - |
| GET | `/api/products/category` | Produtos por categoria | Não | - |
| GET | `/api/products/search` | Buscar produtos | Não | - |
| POST | `/api/products` | Criar produto | Sim | ADMIN |
| PUT | `/api/products/{id}` | Atualizar produto | Sim | ADMIN |
| PATCH | `/api/products/{id}` | Atualizar parcialmente | Sim | ADMIN |
| DELETE | `/api/products/{id}` | Deletar produto | Sim | ADMIN |
| POST | `/api/products/{id}/image` | Upload de imagem | Sim | ADMIN |
| PATCH | `/api/products/{id}/stock` | Atualizar estoque | Sim | ADMIN |

### Pedidos

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/orders` | Listar todos os pedidos | Sim | ADMIN/MANAGER |
| GET | `/api/orders/my-orders` | Pedidos do usuário logado | Sim | USER |
| GET | `/api/orders/{id}` | Buscar pedido por ID | Sim | - |
| GET | `/api/orders/status` | Pedidos por status | Sim | ADMIN/MANAGER |
| POST | `/api/orders` | Criar pedido | Sim | USER |
| PATCH | `/api/orders/{id}/status` | Atualizar status | Sim | ADMIN/MANAGER |
| PATCH | `/api/orders/{id}/cancel` | Cancelar pedido | Sim | USER/ADMIN |
| GET | `/api/orders/statistics` | Estatísticas | Sim | ADMIN |

---

## Modelos de Dados

### LoginRequest

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### LoginResponse

```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;        // "Bearer"
  expiresIn: number;        // segundos
  user: User;
}
```

### User

```typescript
interface User {
  id: number;
  email: string;
  nome: string;
  role: 'ADMIN' | 'USER' | 'MANAGER';
}
```

### Product

```typescript
interface Product {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
  descricao?: string;
  ativo: boolean;
}
```

### Order

```typescript
interface Order {
  id: string;
  cliente: string;
  email: string;
  itens: number;
  total: number;
  data: string;
  status: OrderStatus;
}

type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
```

### CreateOrderRequest

```typescript
interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  notes?: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
```

### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
```

---

## Autenticação JWT

### Como o Front-end Gerencia Autenticação

O `AuthService` é responsável por:

1. **Login**: Envia credenciais para `/api/auth/login`
2. **Armazenamento**: Salva tokens no `localStorage`
3. **Token Refresh**: Renova automaticamente quando expira
4. **Logout**: Remove tokens e redireciona para login
5. **Verificação**: Valida se usuário está autenticado

### Exemplo de Uso no Componente

```typescript
import { AuthService } from './core/services/auth.service';

export class LoginComponent {
  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Login bem-sucedido
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        // Tratar erro
        console.error('Erro no login:', error.message);
      }
    });
  }
}
```

### Verificar Autenticação

```typescript
// Verificar se está autenticado
if (this.authService.isAuthenticated) {
  // Usuário está logado
}

// Obter usuário atual
const user = this.authService.currentUserValue;

// Verificar role
if (this.authService.isAdmin()) {
  // Usuário é admin
}

// Observar mudanças no usuário
this.authService.currentUser$.subscribe(user => {
  console.log('Usuário:', user);
});
```

---

## Interceptors HTTP

### Auth Interceptor

Adiciona automaticamente o token JWT em todas as requisições:

```typescript
// Automaticamente adiciona header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Endpoints públicos (sem token):
- /api/auth/login
- /api/auth/refresh
- /api/auth/register
- /api/public/*
```

### Error Interceptor

Trata erros HTTP globalmente:

- **401 Unauthorized**: Tenta renovar token automaticamente
- **403 Forbidden**: Redireciona para página inicial
- **500 Server Error**: Mostra mensagem de erro
- **0 Network Error**: Avisa sobre problemas de conexão

---

## Guards de Rota

### authGuard

Protege rotas que requerem autenticação:

```typescript
{
  path: 'carrinho',
  component: CartComponent,
  canActivate: [authGuard]
}
```

### adminGuard

Protege rotas que requerem role ADMIN:

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [adminGuard]
}
```

### roleGuard

Guard genérico baseado em roles:

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [roleGuard],
  data: { roles: ['ADMIN', 'MANAGER'] }
}
```

---

## Serviços

### ApiService (Genérico)

```typescript
// GET
this.api.get<Product[]>('/products');

// POST
this.api.post<Product>('/products', productData);

// PUT
this.api.put<Product>(`/products/${id}`, productData);

// DELETE
this.api.delete(`/products/${id}`);

// Upload de arquivo
this.api.uploadFile('/products/1/image', file);

// Download de arquivo
this.api.downloadFile('/reports/sales', 'sales.pdf');
```

### ProductService

```typescript
// Listar produtos
this.productService.getProducts(page, size).subscribe(products => {
  console.log(products);
});

// Buscar por ID
this.productService.getProductById(1).subscribe(product => {
  console.log(product);
});

// Criar produto (Admin)
this.productService.createProduct(productData).subscribe(product => {
  console.log('Produto criado:', product);
});

// Atualizar estoque
this.productService.updateStock(1, 50).subscribe(product => {
  console.log('Estoque atualizado:', product);
});
```

### OrderService

```typescript
// Criar pedido
const order: CreateOrderRequest = {
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  shippingAddress: { /* ... */ },
  paymentMethod: 'credit_card'
};

this.orderService.createOrder(order).subscribe(order => {
  console.log('Pedido criado:', order);
});

// Meus pedidos
this.orderService.getMyOrders().subscribe(orders => {
  console.log('Meus pedidos:', orders);
});

// Atualizar status (Admin)
this.orderService.updateOrderStatus('ORD-001', 'Enviado').subscribe();
```

---

## Como Usar Docker

### 1. Pré-requisitos

- Docker instalado
- Docker Compose instalado

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais reais.

### 3. Build das Imagens

```bash
# Build apenas do front-end
docker build -t raito-frontend .

# Build de todos os serviços
docker-compose build
```

### 4. Iniciar os Containers

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### 5. Acessar a Aplicação

- **Front-end**: http://localhost:4200
- **Back-end API**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 6. Comandos Úteis

```bash
# Restart de um serviço específico
docker-compose restart frontend

# Ver status dos containers
docker-compose ps

# Executar comando dentro do container
docker-compose exec backend bash

# Ver logs de um serviço específico
docker-compose logs -f frontend
```

---

## Deploy em Produção

### 1. Build para Produção

```bash
# Build local
npm run build -- --configuration production

# Build com Docker
docker build -t raito-frontend:1.0.0 .
```

### 2. Variáveis de Ambiente

Configure as variáveis em `environment.ts`:

- `apiUrl`: URL da API em produção
- `production`: true
- `enableDebugLogs`: false
- `enableMockData`: false

### 3. Configuração de CORS no Back-end

O back-end Java Spring deve permitir requisições do front-end:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("https://raitocorp.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 4. Configuração HTTPS

Configure certificado SSL no Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name raitocorp.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... resto da configuração
}
```

---

## Troubleshooting

### Erro 401 - Token Inválido

**Problema**: Requisições retornam 401 Unauthorized

**Solução**:
1. Verificar se o token está sendo enviado corretamente
2. Verificar se o token não expirou
3. Fazer logout e login novamente
4. Verificar configuração do JWT no back-end

### Erro CORS

**Problema**: `Access-Control-Allow-Origin` error

**Solução**:
1. Configurar CORS no back-end Spring
2. Verificar se a URL do front-end está nas origens permitidas
3. Verificar se headers `Authorization` está permitido

### Erro de Conexão (0)

**Problema**: Não consegue conectar ao back-end

**Solução**:
1. Verificar se o back-end está rodando
2. Verificar URL da API em `environment.ts`
3. Verificar firewall/antivírus
4. Testar endpoint diretamente no browser ou Postman

### Token Não Renova Automaticamente

**Problema**: Usuário é deslogado após token expirar

**Solução**:
1. Verificar se o interceptor está configurado corretamente
2. Verificar endpoint `/api/auth/refresh` no back-end
3. Verificar se o refresh token está sendo armazenado

### Docker Não Inicia

**Problema**: Containers não sobem

**Solução**:
```bash
# Ver logs detalhados
docker-compose logs

# Rebuild sem cache
docker-compose build --no-cache

# Remover volumes antigos
docker-compose down -v

# Verificar portas em uso
netstat -ano | findstr :8080
```

---

## Checklist de Implementação no Back-end

Para o time de back-end Java Spring implementar:

### 1. Autenticação JWT

- [ ] Endpoint `/api/auth/login`
- [ ] Endpoint `/api/auth/refresh`
- [ ] Endpoint `/api/auth/logout`
- [ ] Geração de access token (JWT)
- [ ] Geração de refresh token
- [ ] Validação de token em cada requisição
- [ ] Configuração de expiração do token

### 2. Controle de Acesso (RBAC)

- [ ] Implementar roles: USER, ADMIN, MANAGER
- [ ] Annotations `@PreAuthorize` nos endpoints
- [ ] Verificação de role no token JWT

### 3. CRUD de Produtos

- [ ] Implementar todos os endpoints de produtos
- [ ] Paginação com Spring Data
- [ ] Upload de imagens
- [ ] Validação de dados

### 4. CRUD de Pedidos

- [ ] Implementar endpoints de pedidos
- [ ] Relacionamento com produtos
- [ ] Cálculo de total
- [ ] Mudança de status

### 5. Tratamento de Erros

- [ ] Exception handler global
- [ ] Retornar JSON estruturado em erros
- [ ] Códigos HTTP corretos

### 6. Configurações

- [ ] CORS configurado
- [ ] Spring Security com JWT
- [ ] Conexão com PostgreSQL
- [ ] Redis para cache (opcional)
- [ ] Actuator para health check

---

## Estrutura de Response Esperada

### Sucesso

```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operação realizada com sucesso"
}
```

### Erro

```json
{
  "success": false,
  "error": "Descrição do erro",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Contato e Suporte

Para dúvidas sobre a integração:
- Documentação Angular: https://angular.io
- Documentação Spring Boot: https://spring.io/projects/spring-boot

---

**Última atualização**: Janeiro 2025
