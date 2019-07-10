import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ActivatedRoute } from '@angular/router';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { VendaValorRealizadoValores } from 'src/app/_models/Movimentos/Venda/VendaValorRealizadoValores';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-editar-venda',
  templateUrl: './editarVenda.component.html',
  styleUrls: ['./editarVenda.component.css']
})
export class EditarVendaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  editar = false;
  editarValorPrevisto = false;
  editarValorRealizado = false;
  visualizarResumo = false;

  cadastroForm: FormGroup;
  cadastroValorPrevistoForm: FormGroup;
  cadastroValorRealizadoForm: FormGroup;
  cadastroNovoValor: FormGroup;

  pessoas: Pessoa[];
  pessoaIdSelecionado: any;

  idVenda: number;
  venda: Venda;

  vendaItensEntrada: ProdutoItem[];
  vendaItensSaidaComissao: ProdutoItem[];
  vendaItensSaidaGasto: ProdutoItem[];

  valorPrevistoPipe: any;
  valorPrevisto: VendaValorPrevisto;
  valorPrevistoDisabled = true;
  idProdutoItemValorPrevisto: number;

  valorRealizado: VendaValorRealizado;
  idValorRealizado: number;
  idProdutoItemValorRealizado: number;
  valorRealizadoValor: VendaValorRealizadoValores;
  valorRealizadoValores: VendaValorRealizadoValores[] = [];
  valorRealizadoValoresNovo = [];

  novoLancamento = true;
  valorRealizadoNovoPipe: any;
  pessoaIdNovo: any;
  descricaoNovo: any;
  dataPagamentoNovo: any;

  descricaoItem: string;
  subTipoItem: string;
  tipoItem: string;

  status = ['EM ABERTO', 'FINALIZADO'];

  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: ActivatedRoute,
              private vendaService: VendaService,
              private pessoaService: PessoaService,
              public permissaoService: PermissaoService,
              public dataService: DataService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
    this.idVenda = +this.router.snapshot.paramMap.get('id');
    this.validarForm();
    this.validarValorPrevistoForm();
    this.validarNovoValorForm();
    this.getPessoas();
    this.carregarVenda();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR', 'VALOR PREVISTO').subscribe((_PERMISSAO: Permissao) => {
      this.editarValorPrevisto = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR', 'VALOR REALIZADO').subscribe((_PERMISSAO: Permissao) => {
      this.editarValorRealizado = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'VISUALIZAR', 'RESUMO').subscribe((_PERMISSAO: Permissao) => {
      this.visualizarResumo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  carregarVenda() {
    this.venda = null;
    this.vendaService.getVendaById(this.idVenda)
      .subscribe(
        (_VENDA: Venda) => {
          this.venda = Object.assign({}, _VENDA);

          this.venda = Object.assign(this.venda, {
            dataNegociacao: this.dataService.getDataPTBR(this.venda.dataNegociacao),
            dataFinalizado: this.dataService.getDataPTBR(this.venda.dataFinalizado)
          });

          this.cadastroForm.patchValue(this.venda);
          this.vendaItensEntrada = this.venda.vendaProdutos[0].produtos.itens.filter(item => item.tipoItem === 'ENTRADA');
          this.vendaItensEntrada.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id)[0];
          });

          this.vendaItensSaidaComissao = this.venda.vendaProdutos[0].produtos.itens.filter(
            item => item.tipoItem === 'SAIDA' && item.subTipoItem === 'COMISSÃO');
          this.vendaItensSaidaComissao.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id)[0];
          });

          this.vendaItensSaidaGasto = this.venda.vendaProdutos[0].produtos.itens.filter(
            item => item.tipoItem === 'SAIDA' && item.subTipoItem === 'GASTO');
          this.vendaItensSaidaGasto.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id)[0];
          });

        }, error => {
          this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
          console.log(error);
        });
  }

  disabledDataNegociacao() {
    if (this.venda) {
      if (this.venda.dataNegociacao.toString() !== '') {
        return true;
      }
    }
    return false;
  }

  disabledStatus() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO') {
        this.cadastroForm.get('status').disable();
        return true;
      } else {
        this.cadastroForm.get('status').enable();
        return true;
      }
    }
    return true;
  }

  showedDataFinalizado() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO') {
        return true;
      }
    }
    return false;
  }

  setarDataFinalizado(status: string) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (status === 'FINALIZADO') {
      this.cadastroForm.controls.dataFinalizado.setValue(dataAtual);
    } else {
      this.cadastroForm.controls.dataFinalizado.setValue('');
    }
  }

  getNomeCliente() {
    if (this.venda) {
      if (this.venda.clientes) {
        return this.venda.clientes.nomeFantasia;
      }
    }
    return '';
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        clientesId: ['', Validators.required],
        status: ['', Validators.required],
        dataEmissao: [''],
        dataNegociacao: [''],
        dataFinalizado: [''],
        dataHoraUltAlt: ['']
    });
  }

  validarValorPrevistoForm() {
    this.cadastroValorPrevistoForm = this.fb.group({
        id: [''],
        valor: ['', Validators.required]
    });
  }

  verificarPrevisto(vendaValorPrevisto: any): boolean {
    if (vendaValorPrevisto) {
      return true;
    }
    return false;
  }

  verificarPagamento(vendaValorRealizado: any): boolean {
    if (vendaValorRealizado) {
      if (vendaValorRealizado.vendaValorRealizadoValores) {
        if (vendaValorRealizado.vendaValorRealizadoValores.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  verificarStatus() {
    if (this.cadastroForm.get('status')) {
      return this.cadastroForm.get('status').value;
    }
  }

  abrirFormValorPrevisto(idProdutoItem: number, descricaoItem: string, template: any) {
    this.idProdutoItemValorPrevisto = idProdutoItem;
    this.descricaoItem = descricaoItem;
    this.vendaService.getVendaValorPrevistoByProdIdVendId(idProdutoItem, this.idVenda).subscribe(
      (_VALORPREVISTO: VendaValorPrevisto) => {
        if (_VALORPREVISTO) {
          this.valorPrevistoDisabled = true;
          this.valorPrevisto = Object.assign({}, _VALORPREVISTO);
          this.cadastroValorPrevistoForm.patchValue(this.valorPrevisto);
        } else {
          this.valorPrevisto = null;
          this.valorPrevistoDisabled = false;
          this.cadastroValorPrevistoForm.patchValue({id: 0, valor: null});
        }

      }, error => {
        console.log(error.error);
      }
    );
    template.show();
  }

  salvarValorPrevisto(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorPrevisto = Object.assign(this.cadastroValorPrevistoForm.value,
       {id: 0, vendaId: this.idVenda, produtosItensId: this.idProdutoItemValorPrevisto, dataHoraUltAlt: dataAtual});
    this.vendaService.novoVendaValorPrevisto(this.valorPrevisto).subscribe(
      () => {
        this.carregarVenda();
        this.toastr.success('Salvo com Sucesso!');
        template.hide();
      }, error => {
        console.log(error.error);
      }
    );
  }

  validarNovoValorForm() {
    this.cadastroNovoValor = this.fb.group({
        valor: ['', Validators.required],
        pessoasId:  ['', Validators.required],
        dataPagamento: [''],
        descricao:  ['', Validators.required]
    });
  }

  novoValorRealizado() {
    this.novoLancamento = false;
    this.valorRealizadoValoresNovo.push(Object.assign({id: 0, vendaValorRealizadoId: this.idValorRealizado}));
    this.valorRealizadoNovoPipe = null;
    this.descricaoNovo = null;
    this.pessoaIdNovo = null;
  }

  fecharTemplateValorRealizado(template: any) {
    this.valorRealizadoValor = null;
    this.valorRealizadoValoresNovo = [];
    template.hide();
  }

  cadastrarValorRealizado() {
    const dataPag = this.cadastroNovoValor.get('dataPagamento').value.toLocaleString();

    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorRealizadoValor = Object.assign({id: 0, pessoasId: this.pessoaIdNovo, vendaValorRealizadoId: this.idValorRealizado,
    descricao: this.descricaoNovo, dataPagamento: this.dataService.getDataSQL(dataPag),
     dataHoraUltAlt: dataAtual, valor: this.valorRealizadoNovoPipe});

    this.vendaService.novoVendaValorRealizadoValores(this.valorRealizadoValor).subscribe(() => {
      this.valorRealizadoValoresNovo = [];
      this.novoLancamento = true;
      this.carregarVenda();
      this.carregarValores(this.idValorRealizado);
      this.toastr.success('Lançado com Sucesso!');
    });
  }

  abrirFormValorRealizado(idProdutoItem: number, tipoItem: string, subTipoItem: string, descricaoItem: string, template: any) {
    this.descricaoItem = descricaoItem;
    this.novoLancamento = true;
    this.valorRealizadoValor = null;
    this.valorRealizadoValoresNovo = [];
    this.valorRealizadoValores = [];
    this.subTipoItem = subTipoItem;
    this.tipoItem = tipoItem;
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.idProdutoItemValorRealizado = idProdutoItem;
    this.vendaService.getVendaValoresRealizadosByProdIdVendId(idProdutoItem, this.idVenda).subscribe(
      (_VALORREALIZADO: VendaValorRealizado) => {
        if (_VALORREALIZADO) {
          this.idValorRealizado = _VALORREALIZADO.id;
          this.valorRealizado = Object.assign({}, _VALORREALIZADO);
          this.valorRealizadoValores = _VALORREALIZADO.vendaValorRealizadoValores;

        } else {
          this.valorRealizado = Object.assign({id: 0, vendaId: this.idVenda, produtosItensId: idProdutoItem, dataHoraUltAlt: dataAtual});
          this.vendaService.novoVendaValorRealizado(this.valorRealizado).subscribe(() => {
            this.vendaService.getIdUltimoValorRealizado().subscribe((_ID: VendaValorRealizado) => {
              this.idValorRealizado = _ID.id;
            });
          });
        }

      }, error => {
        console.log(error.error);
      }
    );
    template.show();
  }

  carregarValores(idValorRealizado: number) {
    this.vendaService.getValorRealizadoValores(idValorRealizado).subscribe(
    (_VALORES: VendaValorRealizadoValores[]) => {
      this.valorRealizadoValores = _VALORES;
    });
    this.vendaItensSaidaComissao.forEach(item => {
      this.vendaService.getVendaValoresRealizadosByProdIdVendId(item.id, this.idVenda)
      .subscribe((_VALORES: VendaValorRealizado) => {
        if (_VALORES) {
          item.vendaValorRealizado = _VALORES;
        }
      });
    });
  }

  getPessoas() {
    this.pessoaService.getAllPessoa().subscribe(
      (_PESSOAS: Pessoa[]) => {
      this.pessoas = _PESSOAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar pessoas: ${error.error}`);
    });
  }

  salvarAlteracoes() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const dataNeg = this.cadastroForm.get('dataNegociacao').value.toLocaleString();

    this.venda = Object.assign(this.cadastroForm.value, {id: this.venda.id,
      dataNegociacao: this.dataService.getDataSQL(dataNeg),
      dataHoraUltAlt: dataAtual
    });
    this.vendaService.editarVenda(this.venda).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarVenda();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error);
      });
  }

}
