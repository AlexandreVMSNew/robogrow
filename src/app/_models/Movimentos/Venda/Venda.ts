import { VendaObservacao } from './VendaObservacao';
import { VendaValorPrevisto } from './VendaValorPrevisto';
import { VendaValorRealizado } from './VendaValorRealizado';
import { Cliente } from '../../Cadastros/Clientes/Cliente';
import { ContasPagarParcelas } from '../../Financeiro/ContasPagar/ContasPagarParcelas';
import { ContasReceberParcelas } from '../../Financeiro/ContasReceber/ContasReceberParcelas';
import { Produto } from '../../Cadastros/Produtos/produto';
import { VendaProduto } from './VendaProduto';

export class Venda {
    id: number;
    clientesId: number;
    clientes: Cliente;
    status: string;
    dataEmissao: Date;
    dataNegociacao: Date;
    dataFinalizado: Date;
    dataHoraUltAlt: Date;
    observacoes: VendaObservacao[];
    vendaProdutos: VendaProduto[];
    contasPagarParcelas: ContasPagarParcelas[];
    contasReceberParcelas: ContasReceberParcelas[];
    vendaValorPrevisto: VendaValorPrevisto[];
    vendaValorRealizado: VendaValorRealizado[];
}
