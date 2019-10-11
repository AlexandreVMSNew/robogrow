/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VendaPublicacoesComponent } from './vendaPublicacoes.component';

describe('VendaPublicacoesComponent', () => {
  let component: VendaPublicacoesComponent;
  let fixture: ComponentFixture<VendaPublicacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendaPublicacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaPublicacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
