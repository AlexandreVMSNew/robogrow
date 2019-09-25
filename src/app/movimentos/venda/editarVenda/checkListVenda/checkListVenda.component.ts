import { Component, OnInit, Input } from '@angular/core';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';

@Component({
  selector: 'app-check-list-venda',
  templateUrl: './checkListVenda.component.html',
  styleUrls: ['./checkListVenda.component.css']
})
export class CheckListVendaComponent implements OnInit {

  @Input() venda: Venda;

  constructor() { }

  ngOnInit() {
  }

}
