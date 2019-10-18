import { Injectable } from '@angular/core';
import { PermissaoService } from '../_services/Permissoes/permissao.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  idUsuario: number;
  menus = [
    {
      title: 'Geral',
      type: 'header'
    },
    {
      title: 'Dashboard',
      icon: 'fa fa-dashboard',
      active: false,
      type: 'simple',
      badge: {
        text: 'New ',
        class: 'badge-warning'
      },
      link: 'dashboard'
    },
    {
      title: 'Autorizações',
      icon: 'fa fa-gavel',
      active: false,
      type: 'simple',
      badge: {
        text: '0',
        class: 'badge-warning'
      },
      link: 'autorizacoes'
    },
    {
      title: 'Cadastros',
      icon: 'fa fa-file-alt',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Minhas Empresas',
          link: 'empresas',
          icon: 'fa fa-building-o'
        },
        {
          title: 'Usuários',
          link: 'usuarios',
          icon: 'fa fa-user-o'
        },
        {
          title: 'Clientes',
          link: 'clientes',
          icon: 'fa fa-users'
        },
        {
          title: 'Pessoas',
          link: 'pessoas',
          icon: 'fa fa-users'
        },
        {
          title: 'Produtos',
          link: 'produtos',
          icon: 'fa fa-dropbox'
        },
        {
          title: 'Plano de Contas',
          link: 'plano-conta',
          icon: 'fa fa-sitemap'
        },
        {
          title: 'Centro de Receita',
          link: 'centro-receita',
          icon: 'fa fa-arrow-right'
        },
        {
          title: 'Centro de Despesa',
          link: 'centro-despesa',
          icon: 'fa fa-arrow-left'
        },
        {
          title: 'Plano de Pagamento',
          link: 'plano-pagamento',
          icon: 'fa fa-sitemap'
        },
        {
          title: 'Forma de Pagamento',
          link: 'forma-pagamento',
          icon: 'fa fa-dollar'
        }
      ]
    },
    {
      title: 'Atendimentos',
      icon: 'fa fa-phone',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Retornos',
          icon: 'fa fa-phone',
          link: 'atendimentos/retornos'
        }
      ]
    },
    {
      title: 'Financeiro',
      icon: 'fa fa-dollar',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Recebimentos',
          icon: 'fa fa-arrow-right',
          link: 'financeiro/recebimentos'
        },
        {
          title: 'Pagamentos',
          icon: 'fa fa-arrow-left',
          link: 'financeiro/pagamentos'
        },
        {
          title: 'Lançamentos',
          icon: 'fa fa-exchange',
          link: 'financeiro/lancamentos'
        },
        {
          title: 'Relatórios Lançamentos',
          icon: 'fa fa-chart-line',
          link: 'financeiro/lancamentos/relatorios'
        },
        {
          title: 'Cheques Pré-Datado',
          icon: 'fa fa-credit-card',
          link: 'cheque-pre'
        }
      ]
    },
    {
      title: 'Movimentos',
      icon: 'fa fa-handshake',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Venda',
          icon: 'fa fa-shopping-cart',
          link: 'movimentos/vendas'
        },
        {
          title: 'Relatórios Venda',
          icon: 'fa fa-shopping-cart',
          link: 'movimentos/vendas/relatorios'
        }
      ]
    },
    {
      title: 'Publicações',
      icon: 'fa fa-handshake',
      active: false,
      type: 'simple',
      link: 'publicacoes'
    },
    {
      title: 'Configurações',
      type: 'header'
    },
    {
      title: 'Permissões',
      icon: 'fa fa-lock',
      active: false,
      type: 'simple',
      link: 'permissoes'
    },
    {
      title: 'Meu Perfil',
      icon: 'fa fa-user-o',
      active: false,
      type: 'simple',
      link: 'usuarios/editar/' + this.permissaoService.getUsuarioId()
    }
  ];

  constructor(private permissaoService: PermissaoService) {
    if (this.permissaoService.getUsuarioId() !== null) {
      this.idUsuario = this.permissaoService.getUsuarioId();
    }
  }

  toggle() {
    this.toggled = ! this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }
}
