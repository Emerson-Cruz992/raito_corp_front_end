/**
 * Model: Usuario
 * Representa um usuário do sistema
 */
export interface Usuario {
  idUsuario: string;
  nome: string;
  sobrenome?: string;
  tipoUsuario: string;
  ativo: boolean;
  criadoEm?: Date;
}

/**
 * DTO para criação de usuário
 */
export interface CriarUsuarioDTO {
  nome: string;
  sobrenome?: string;
  tipoUsuario: string;
}

/**
 * DTO para atualização de usuário
 */
export interface AtualizarUsuarioDTO {
  nome?: string;
  sobrenome?: string;
  tipoUsuario?: string;
  ativo?: boolean;
}
