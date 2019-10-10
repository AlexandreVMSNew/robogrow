/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PermissaoComponent } from './permissao.component';

describe('PermissaoComponent', () => {
  let component: PermissaoComponent;
  let fixture: ComponentFixture<PermissaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
