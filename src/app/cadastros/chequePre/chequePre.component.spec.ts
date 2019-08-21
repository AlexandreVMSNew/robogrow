/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChequePreComponent } from './chequePre.component';

describe('ChequePreComponent', () => {
  let component: ChequePreComponent;
  let fixture: ComponentFixture<ChequePreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequePreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequePreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
