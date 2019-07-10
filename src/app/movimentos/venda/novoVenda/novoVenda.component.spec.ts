/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NovoVendaComponent } from './novoVenda.component';

describe('NovoVendaComponent', () => {
  let component: NovoVendaComponent;
  let fixture: ComponentFixture<NovoVendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoVendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
