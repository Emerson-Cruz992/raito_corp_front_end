// Exportações principais de todos os services
export * from './api.service';
export * from './error-handler.service';

// Services de Cadastro
export * from './cadastro/usuario.service';
export * from './cadastro/cliente.service';
export * from './cadastro/endereco.service';
export * from './cadastro/credencial.service';
export * from './cadastro/perfil-acesso.service';

// Services de Catálogo
export * from './catalogo/produto.service';

// Services de Estoque
export * from './estoque/estoque.service';

// Services de Vendas
export * from './vendas/carrinho.service';
export * from './vendas/pedido.service';

// Auth service
export * from './auth.service';
