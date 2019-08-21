/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CentroDespesaComponent } from './centroDespesa.component';

describe('CentroDespesaComponent', () => {
  let component: CentroDespesaComponent;
  let fixture: ComponentFixture<CentroDespesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroDespesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
