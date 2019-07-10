/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VendaComponent } from './venda.component';

describe('VendaComponent', () => {
  let component: VendaComponent;
  let fixture: ComponentFixture<VendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
