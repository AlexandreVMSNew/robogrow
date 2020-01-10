/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoolerComponent } from './cooler.component';

describe('CoolerComponent', () => {
  let component: CoolerComponent;
  let fixture: ComponentFixture<CoolerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
