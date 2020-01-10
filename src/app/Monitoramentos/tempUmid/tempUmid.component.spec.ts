/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TempUmidComponent } from './tempUmid.component';

describe('TempUmidComponent', () => {
  let component: TempUmidComponent;
  let fixture: ComponentFixture<TempUmidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempUmidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempUmidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
