/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReleManutencaoComponent } from './rele-manutencao.component';

describe('ReleManutencaoComponent', () => {
  let component: ReleManutencaoComponent;
  let fixture: ComponentFixture<ReleManutencaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleManutencaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleManutencaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
