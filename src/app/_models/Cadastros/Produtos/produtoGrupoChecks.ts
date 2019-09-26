import { ProdutoCheckList } from './produtoCheckList';
import { ProdutoCheckListOpcoes } from './ProdutoCheckListOpcoes';

export class ProdutoGrupoChecks {
    id: number;
    descricao: string;
    produtosId: number;
    checkList: ProdutoCheckList[];
    checkListOpcoes: ProdutoCheckListOpcoes[];
}
