import { VendaObservacao } from './VendaObservacao';
import { VendaValorPrevisto } from './VendaValorPrevisto';
import { VendaValorRealizado } from './VendaValorRealizado';
import { Cliente } from '../../Cadastros/Clientes/Cliente';
import { VendaProduto } from './VendaProduto';
import { VendaCheckList } from './VendaCheckList';
import { Empresa } from '../../Cadastros/Empresas/Empresa';
import { Pessoa } from '../../Cadastros/Pessoas/Pessoa';
import { PlanoPagamento } from '../../Cadastros/PlanoPagamento/PlanoPagamento';

export class Venda {
    id: number;
    empresasId: number;
    empresas: Empresa;
    vendedorId: number;
    vendedor: Pessoa;
    clientesId: number;
    clientes: Cliente;
    planoPagamentoId: number;
    planoPagamento: PlanoPagamento;
    status: string;
    observacoes: string;
    dataEmissao: Date;
    dataNegociacao: Date;
    dataFinalizado: Date;
    dataHoraUltAlt: Date;
    vendaProdutos: VendaProduto[];
    vendaCheckList: VendaCheckList[];
    vendaValorPrevisto: VendaValorPrevisto[];
    vendaValorRealizado: VendaValorRealizado[];
}
