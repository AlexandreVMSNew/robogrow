/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LuzExaustorComponent } from './luz-exaustor.component';

describe('LuzExaustorComponent', () => {
  let component: LuzExaustorComponent;
  let fixture: ComponentFixture<LuzExaustorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuzExaustorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuzExaustorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
