/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecebimentosVendaComponent } from './recebimentosVenda.component';

describe('RecebimentosVendaComponent', () => {
  let component: RecebimentosVendaComponent;
  let fixture: ComponentFixture<RecebimentosVendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecebimentosVendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecebimentosVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
