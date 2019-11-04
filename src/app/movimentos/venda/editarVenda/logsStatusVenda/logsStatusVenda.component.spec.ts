/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogsStatusVendaComponent } from './logsStatusVenda.component';

describe('LogsStatusVendaComponent', () => {
  let component: LogsStatusVendaComponent;
  let fixture: ComponentFixture<LogsStatusVendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsStatusVendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsStatusVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
