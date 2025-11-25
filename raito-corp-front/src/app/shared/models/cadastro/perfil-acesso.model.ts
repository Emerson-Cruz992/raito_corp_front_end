/**
 * Model: PerfilAcesso
 * Representa um perfil de acesso no sistema
 */
export interface PerfilAcesso {
  idPerfil: string;
  nome: string;
  descricao?: string;
}

/**
 * DTO para criação de perfil de acesso
 */
export interface CriarPerfilAcessoDTO {
  nome: string;
  descricao?: string;
}

/**
 * DTO para atualização de perfil de acesso
 */
export interface AtualizarPerfilAcessoDTO {
  nome?: string;
  descricao?: string;
}

/**
 * Model: UsuariosPerfis
 * Representa a relação entre usuário e perfil
 */
export interface UsuariosPerfis {
  idUsuario: string;
  idPerfil: string;
}
