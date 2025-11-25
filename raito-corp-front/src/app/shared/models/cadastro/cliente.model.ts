/**
 * Model: Cliente
 * Representa um cliente do sistema (extensão de usuário)
 */
export interface Cliente {
  idCliente: string;
  idUsuario: string;
  cpf: string;
  data_nascimento: Date;
  celular: string;
  criadoEm?: Date;
}

/**
 * DTO para criação de cliente
 */
export interface CriarClienteDTO {
  idUsuario: string;
  cpf: string;
  data_nascimento: string; // formato: YYYY-MM-DD
  celular: string;
}

/**
 * DTO para atualização de cliente
 */
export interface AtualizarClienteDTO {
  cpf?: string;
  data_nascimento?: string;
  celular?: string;
}
