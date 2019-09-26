import { VendaObservacao } from './VendaObservacao';
import { VendaValorPrevisto } from './VendaValorPrevisto';
import { VendaValorRealizado } from './VendaValorRealizado';
import { Cliente } from '../../Cadastros/Clientes/Cliente';
import { VendaProduto } from './VendaProduto';
import { VendaCheckList } from './VendaCheckList';

export class Venda {
    id: number;
    empresasId: number;
    vendedorId: number;
    clientesId: number;
    clientes: Cliente;
    status: string;
    dataEmissao: Date;
    dataNegociacao: Date;
    dataFinalizado: Date;
    dataHoraUltAlt: Date;
    observacoes: VendaObservacao[];
    vendaProdutos: VendaProduto[];
    vendaCheckList: VendaCheckList[];
    vendaValorPrevisto: VendaValorPrevisto[];
    vendaValorRealizado: VendaValorRealizado[];
}
