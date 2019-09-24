import { ProdutoItem } from './produtoItem';

export class Produto {
    id: number;
    descricao: string;
    valorMinimo: number;
    itens: ProdutoItem[];
}
