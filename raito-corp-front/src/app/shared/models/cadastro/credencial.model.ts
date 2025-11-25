/**
 * Model: Credencial
 * Representa as credenciais de acesso de um usuário
 */
export interface Credencial {
  idCredencial: string;
  idUsuario: string;
  email: string;
  tentativasLogin?: number;
  bloqueado: boolean;
  ultimoLogin?: Date;
  criadoEm?: Date;
}

/**
 * DTO para criação de credencial
 */
export interface CriarCredencialDTO {
  idUsuario: string;
  email: string;
  senhaHash: string;
}

/**
 * DTO para login
 */
export interface LoginDTO {
  email: string;
  senha: string;
}

/**
 * Resposta do login
 */
export interface LoginResponse {
  idUsuario: string;
  email: string;
  nome: string;
  token?: string;
  perfis?: string[];
}
