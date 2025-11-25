/**
 * Model: Endereco
 * Representa um endereço de entrega/cobrança
 */
export interface Endereco {
  idEndereco: string;
  idCliente: string;
  cep: string;
  rua: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  tipoEndereco?: string;
  enderecoPrincipal?: boolean;
  criadoEm?: Date;
}

/**
 * DTO para criação de endereço
 */
export interface CriarEnderecoDTO {
  idCliente: string;
  cep: string;
  rua: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  enderecoPrincipal?: boolean;
}

/**
 * DTO para atualização de endereço
 */
export interface AtualizarEnderecoDTO {
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  tipoEndereco?: string;
  enderecoPrincipal?: boolean;
}
