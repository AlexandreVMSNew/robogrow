import { ProdutoItem } from './produtoItem';
import { ProdutoGrupoChecks } from './produtoGrupoChecks';

export class Produto {
    id: number;
    descricao: string;
    valorMinimo: number;
    itens: ProdutoItem[];
    grupoChecks: ProdutoGrupoChecks[];
}
