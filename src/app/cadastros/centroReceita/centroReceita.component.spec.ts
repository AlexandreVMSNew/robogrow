/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CentroReceitaComponent } from './centroReceita.component';

describe('CentroReceitaComponent', () => {
  let component: CentroReceitaComponent;
  let fixture: ComponentFixture<CentroReceitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroReceitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroReceitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
