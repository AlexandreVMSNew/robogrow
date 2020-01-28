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
      title: 'Cadastros',
      icon: 'fa fa-file-alt',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Usuários',
          link: 'usuarios',
          icon: 'fa fa-user-o'
        }
      ]
    },
    {
      title: 'Painel de Controle',
      icon: 'fa fa-file-alt',
      active: false,
      type: 'simple',
      link: 'painel-controle'
    },
    {
      title: 'Sensores',
      icon: 'fa fa-file-alt',
      active: false,
      type: 'simple',
      link: 'sensores'
    },
    {
      title: 'TimeLine',
      icon: 'far fa-newspaper',
      active: false,
      type: 'simple',
      link: 'timeline'
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
      icon: 'fas fa-user-edit',
      active: false,
      type: 'simple',
      link: 'usuarios/editar/' + this.permissaoService.getUsuarioId()
    }
  ];

  constructor(private permissaoService: PermissaoService) {
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
