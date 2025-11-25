/**
 * Model: CaracteristicaIluminacao
 * Representa características técnicas de iluminação de um produto
 */
export interface CaracteristicaIluminacao {
  id: string;
  idProduto: string;
  potencia: string;
  temperaturaCor: string;
  fluxoLuminoso: string;
  tensao?: string;
  eficiencia?: string;
  indiceProtecao?: string;
  regulavel: boolean;
}

/**
 * DTO para criação de característica de iluminação
 */
export interface CriarCaracteristicaIluminacaoDTO {
  potencia: string;
  temperaturaCor: string;
  fluxoLuminoso: string;
  tensao?: string;
  eficiencia?: string;
  indiceProtecao?: string;
  regulavel?: boolean;
}

/**
 * DTO para atualização de característica de iluminação
 */
export interface AtualizarCaracteristicaIluminacaoDTO {
  potencia?: string;
  temperaturaCor?: string;
  fluxoLuminoso?: string;
  tensao?: string;
  eficiencia?: string;
  indiceProtecao?: string;
  regulavel?: boolean;
}
